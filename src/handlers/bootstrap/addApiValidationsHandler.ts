import ApiContex from "../../data/apiContex";
import ApiDefinition from "../../data/apiDefinition";
import Unit from "../../mediator/Data/unit";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import PropertyValidationError from "../../Errors/propertyValidationError";
import AddApiValidationsTaskReqeust from "../../messeges/bootstrap/addApiValidationsTaskReqeust";
import getFunctions from "../../helpers/getFunctions";

export default class AddApiValidationsHandler
    implements IRequestHandler<AddApiValidationsTaskReqeust, Unit>
{
    messegeType = AddApiValidationsTaskReqeust.name;

    async handle(request: AddApiValidationsTaskReqeust): Promise<void> {
        const functions = getFunctions(request.validationFunctions);
        request.apiDefinitions.forEach(api => {
            for (let nestedApi of api.nestedApis)
                this.addApiValidation(nestedApi, request.apiContex, functions);
            this.addApiValidation(api, request.apiContex, functions);
        });
    }

    addApiValidation(apiDefinition: ApiDefinition, apiContex: ApiContex, functions: any) {
        const createAndAlterValidation = apiDefinition.validations.createAndAlter;
        const createAndAlterType = apiDefinition.types.createAndAlter;
        const alterType = apiDefinition.types.alter;
        apiDefinition.validateCreate = this.getValidation(createAndAlterValidation, apiContex, createAndAlterType, true, functions);

        const alterValidation = apiDefinition.validations.alter;

        apiDefinition.validateReplace = this.getValidation(alterValidation, apiContex, alterType, true, functions);
        apiDefinition.validateUpdate = this.getValidation(alterValidation, apiContex, alterType, false, functions);
    }

    getValidation(validationDefinition: any, apiContex: ApiContex, typeDefinition: any, isValidateUndefined: boolean, functions: any) {
        const validationFunctions: any = {};
        const variables: any = {};
        for (let [propertyOrValidationName, value] of Object.entries(validationDefinition)) {
            const isProperty = typeDefinition[propertyOrValidationName] != null;
            if (isProperty)
                this.AddPropertyValidations(functions, value, validationFunctions, isValidateUndefined, propertyOrValidationName);
            else if (propertyOrValidationName == 'variables') {
                for (let [variableName, variableScript] of Object.entries(value as any))
                    variables[variableName] = this.getScriptFunction(variableScript as string);
            } else
                validationFunctions["resource." + propertyOrValidationName] = this.getScriptFunction(value as string);
        };
        return async (resource: any) => await this.validateResource(validationFunctions, apiContex, variables, resource);
    }

    AddPropertyValidations(functions: any, propertyValidations: any, validationFunctions: any, isValidateUndefined: boolean, propertyName: string) {
        Object.entries(propertyValidations).forEach(([validationName, validationArg]) => {
            const validationFunction = functions[validationName];
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