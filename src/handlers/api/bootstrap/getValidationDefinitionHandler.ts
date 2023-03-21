import ApiContex from "../../../data/apiContex";
import Unit from "../../../mediator/Data/unit";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../../helpers/scriptsBuilder';
import PropertyValidationError from "../../../Errors/propertyValidationError";
import GetValidationDefinitionRequest from "../../../messeges/bootstrap/getValidationDefinitionRequest";
import Result from "../../../mediator/Data/result";
import ValidationDefinition from "../../../data/modules/validationDefinition";

export default class GetValidationDefinitionHandler
    implements IRequestHandler<GetValidationDefinitionRequest, Unit>
{
    messegeType = GetValidationDefinitionRequest.name;

    async handle(request: GetValidationDefinitionRequest, result: Result<ValidationDefinition>): Promise<void> {
        const validation = new ValidationDefinition();
        validation.create = this.getValidation(request.resourceConfig.create.input, request.apiContex, true);
        validation.replace = this.getValidation(request.resourceConfig.alter.input, request.apiContex, true);
        validation.update = this.getValidation(request.resourceConfig.alter.input, request.apiContex, false);
        result.value = validation;
    }

    /*            else if (propertyOrValidationName == 'variables') {
                for (let [variableName, variableScript] of Object.entries(value as any))
                    variables[variableName] = this.getScriptFunction(variableScript as string);
            } else
                validationFunctions["resource." + propertyOrValidationName] = this.getScriptFunction(value as string);
                */

    getValidation(validationDefinition: any, apiContex: ApiContex, isValidateUndefined: boolean) {
        const validationFunctions: any = {};
        const variables: any = {};
        if (validationDefinition)
            for (let [propertyOrValidationName, value] of Object.entries(validationDefinition))
                this.AddPropertyValidations(apiContex.validation, value, validationFunctions, isValidateUndefined, propertyOrValidationName);
        return async (user: any, resource: any) => await this.validateResource(validationFunctions, user, apiContex, variables, resource);
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

    async validateResource(validationFunctions: any, user: any, apiContex: ApiContex, variables: any, resource: any) {
        const errors = [];
        const variablesValue: any = {};
        const context = { ...apiContex, user: user, input: resource, variables: variablesValue };
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