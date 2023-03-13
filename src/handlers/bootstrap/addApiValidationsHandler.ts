import ApiContex from "../../data/apiContex";
import ApiDefinition from "../../data/apiDefinition";
import Unit from "../../mediator/Data/unit";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import PropertyValidationError from "../../Errors/propertyValidationError";
import validationFactory from "../../factories/validationFactory";
import ApiDefinitionTaskReqeust from "../../messeges/bootstrap/apiDefinitionTaskReqeust";

const validationsFunctions = validationFactory();

export default class AddApiValidationsHandler
    implements IRequestHandler<ApiDefinitionTaskReqeust, Unit>
{
    messegeType = ApiDefinitionTaskReqeust.name;

    async handle(request: ApiDefinitionTaskReqeust): Promise<void> {
        request.apiDefinitions.forEach(apiDefinition => this.addApiValidation(apiDefinition, request.apiContex));
    }


    addApiValidation(apiDefinition: ApiDefinition, apiContex: ApiContex) {
        const createAndAlterValidation = apiDefinition.validations.createAndAlter;
        const createAndAlterType = apiDefinition.types.createAndAlter;
        const alterType = apiDefinition.types.alter;
        apiDefinition.validateCreate = this.getValidation(createAndAlterValidation, apiContex, createAndAlterType, true);

        const alterValidation = apiDefinition.validations.alter;

        apiDefinition.validateReplace = this.getValidation(alterValidation, apiContex, alterType, true);
        apiDefinition.validateUpdate = this.getValidation(alterValidation, apiContex, alterType, false);
    }

    getValidation(validationDefinition: any, apiContex: ApiContex, typeDefinition: any, isValidateUndefined: boolean) {
        const validationFunctions: any = {};
        const variables: any = {};
        for (let [propertyOrValidationName, value] of Object.entries(validationDefinition)) {
            const isProperty = typeDefinition[propertyOrValidationName] != null;
            if (isProperty)
                this.AddPropertyValidations(value, validationFunctions, isValidateUndefined, propertyOrValidationName);
            else if (propertyOrValidationName == 'variables') {
                for (let [variableName, variableScript] of Object.entries(value as any))
                    variables[variableName] = this.getScriptFunction(variableScript as string);
            } else
                validationFunctions["resource." + propertyOrValidationName] = this.getScriptFunction(value as string);
        };
        return async (resource: any) => await this.validateResource(validationFunctions, apiContex, variables, resource);
    }

    AddPropertyValidations(propertyValidations: any, validationFunctions: any, isValidateUndefined: boolean, propertyName: string) {
        Object.entries(propertyValidations).forEach(([validationName, validationArg]) => {
            const validationFunction = validationsFunctions[validationName];
            const propertyValidationFunction = validationFunction ?
                this.getPropertyFunction(isValidateUndefined, propertyName, validationFunction, validationArg) :
                this.getScriptFunction(validationArg as string);
            validationFunctions[propertyName + "." + validationName] = propertyValidationFunction
        });
    }

    async validateResource(validationFunctions: any, apiContex: ApiContex, variables: any, resource: any) {
        const errors = [];
        const variablesValue: any = {};
        const context = { ...apiContex, input: resource, variables: variablesValue };
        for (let [variablename, func] of Object.entries(variables)) {
            const value = await (func as any)(context);
            variablesValue[variablename] = value;
        }
        for (let [validationName, func] of Object.entries(validationFunctions)) {
            const isValid = await (func as any)(context);
            if (!isValid) {
                const split = validationName.split('.');
                errors.push(new PropertyValidationError(split[0], split[1]));
            }
        }
        return errors;
    }

    getPropertyFunction(isValidateUndefined: boolean, propertyName: string, validationFunction: any, validationArg: any) {
        return (context: any) => {
            if (!isValidateUndefined && !context.input[propertyName])
                return true;
            return validationFunction(context.input[propertyName], validationArg);
        };
    }

    getScriptFunction(validationScript: string) {
        const script = scriptsBuilder.stringToScript(validationScript);
        return (context: any) => {
            return scriptsBuilder.runScript(script, context);
        };
    }
}