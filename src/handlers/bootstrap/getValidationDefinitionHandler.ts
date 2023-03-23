import ApiContex from "../../data/apiContex";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import PropertyValidationError from "../../Errors/propertyValidationError";
import GetValidationDefinitionRequest from "../../messeges/bootstrap/getValidationDefinitionRequest";
import Result from "../../mediator/Data/result";
import ValidationDefinition from "../../data/modules/validationDefinition";
import InputConfig from "../../data/input/inputConfig";
import Dictionary from "../../general/dictionary";

export default class GetValidationDefinitionHandler
    implements IRequestHandler<GetValidationDefinitionRequest, ValidationDefinition>
{
    messegeType = GetValidationDefinitionRequest.name;

    async handle(request: GetValidationDefinitionRequest, result: Result<ValidationDefinition>): Promise<void> {
        const validation = new ValidationDefinition();
        validation.create = this.getValidation(request.resourceConfig.create, true);
        validation.replace = this.getValidation(request.resourceConfig.alter, true);
        validation.update = this.getValidation(request.resourceConfig.alter, false);
        result.value = validation;
    }

    getValidation(validationConfig: InputConfig, isValidateUndefined: boolean) {

        const propertiesValidation = this.getPropertiesValidation(validationConfig.input, isValidateUndefined);

        const variables = this.getFunctions(validationConfig.variables);
        const validations = this.getFunctions(validationConfig.validations);

        return async (apiContex: ApiContex, resource: any) =>
            await this.validateResource(apiContex, resource, propertiesValidation, variables, validations);
    }

    private getFunctions(functionsConfig: Dictionary<string>) {
        const functions = new Dictionary<any>;
        if (functionsConfig)
            for (let [name, script] of Object.entries(functionsConfig))
                functions[name] = this.getScriptFunction(script);
        return functions;
    }

    private getPropertiesValidation(input: Dictionary<any>, isValidateUndefined: boolean) {
        const propertiesValidation = new Dictionary<Dictionary<string>>();
        if (input)
            for (let [propertyName, value] of Object.entries(input))
                propertiesValidation[propertyName] = this.getPropertyValidation(value, isValidateUndefined, propertyName);
        return propertiesValidation;
    }

    getPropertyValidation(propertyValidations: any, isValidateUndefined: boolean, propertyName: string): Dictionary<any> {
        const propertyValidation = new Dictionary<any>();
        if (this.isString(propertyValidations))
            propertyValidation[propertyValidations] = this.getPropertyFunction(isValidateUndefined, propertyValidations, propertyName, {});
        else
            for (let [validationName, validationArg] of Object.entries(propertyValidations))
                propertyValidation[validationName] = this.getPropertyFunction(isValidateUndefined, validationName, propertyName, validationArg);
        return propertyValidation;
    }

    async validateResource(apiContex: ApiContex, input: any, propertiesValidation: any, variables: any, validations: any) {
        const errors = [];
        apiContex.input = input;
        for (let [propertyName, validations] of Object.entries(propertiesValidation)) {
            for (let [validationName, validationsFunc] of Object.entries(validations as any)) {
                const isValid = await (validationsFunc as any)(apiContex);
                if (!isValid)
                    errors.push(new PropertyValidationError(propertyName, validationName));
            }
        }
        if (errors.length > 0)
            return errors;
        for (let [variablename, func] of Object.entries(variables)) {
            const value = await (func as any)(apiContex);
            apiContex.variables[variablename] = value;
        }
        for (let [name, func] of Object.entries(validations)) {
            const isValid = await (func as any)(apiContex);
            if (!isValid)
                errors.push(new PropertyValidationError("general", name));
        }
        return errors;
    }

    getPropertyFunction(isValidateUndefined: boolean, validationName: string, propertyName: string, validationArg: any) {
        return (context: ApiContex) => {
            if (!isValidateUndefined && !context.input[propertyName])
                return true;
            const validationFunction = context.validations[validationName];
            return validationFunction(context.input[propertyName], validationArg);
        };
    }

    getScriptFunction(validationScript: string) {
        const script = scriptsBuilder.stringToScript(validationScript);
        return (context: any) => {
            return scriptsBuilder.runScript(script, context);
        };
    }

    isString(obj: any): obj is string {
        return typeof obj === "string";
    }
}