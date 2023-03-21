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
        validation.create = this.getValidation(request.resourceConfig.create, request.apiContex, true);
        validation.replace = this.getValidation(request.resourceConfig.alter, request.apiContex, true);
        validation.update = this.getValidation(request.resourceConfig.alter, request.apiContex, false);
        result.value = validation;
    }

    getValidation(validationConfig: InputConfig, apiContex: ApiContex, isValidateUndefined: boolean) {

        const propertiesValidation = this.getPropertiesValidation(validationConfig.input, apiContex, isValidateUndefined);

        const variables = this.getFunctions(validationConfig.variables);
        const validations = this.getFunctions(validationConfig.validations);

        return async (user: any, resource: any) =>
            await this.validateResource(user, apiContex, resource, propertiesValidation, variables, validations);
    }

    private getFunctions(functionsConfig: Dictionary<string>) {
        const functions = new Dictionary<any>;
        if (functionsConfig)
            for (let [name, script] of Object.entries(functionsConfig))
                functions[name] = this.getScriptFunction(script);
        return functions;
    }

    private getPropertiesValidation(input: Dictionary<any>, apiContex: ApiContex, isValidateUndefined: boolean) {
        const propertiesValidation = new Dictionary<Dictionary<string>>();
        if (input)
            for (let [propertyName, value] of Object.entries(input))
                propertiesValidation[propertyName] = this.getPropertyValidation(apiContex.validation, value, isValidateUndefined, propertyName);
        return propertiesValidation;
    }

    getPropertyValidation(functions: any, propertyValidations: any, isValidateUndefined: boolean, propertyName: string): Dictionary<any> {
        const propertyValidation = new Dictionary<any>();
        for (let [validationName, validationArg] of Object.entries(propertyValidations)) {
            const validationFunction = functions[validationName];
            const propertyValidationFunction = validationFunction ?
                this.getPropertyFunction(isValidateUndefined, propertyName, validationFunction, validationArg) :
                this.getScriptFunction(validationArg as string);
            propertyValidation[validationName] = propertyValidationFunction
        };
        return propertyValidation;
    }

    async validateResource(user: any, apiContex: ApiContex, input: any, propertiesValidation: any, variables: any, validations: any) {
        const errors = [];
        const variablesValue: any = {};
        const context = { ...apiContex, user: user, input: input, variables: variablesValue };
        for (let [propertyName, validations] of Object.entries(propertiesValidation)) {
            for (let [validationName, validationsFunc] of Object.entries(validations as any)) {
                const isValid = await (validationsFunc as any)(context);
                if (!isValid)
                    errors.push(new PropertyValidationError(propertyName, validationName));
            }
        }
        if (errors.length > 0)
            return errors;
        for (let [variablename, func] of Object.entries(variables)) {
            const value = await (func as any)(context);
            variablesValue[variablename] = value;
        }
        for (let [name, func] of Object.entries(validations)) {
            const isValid = await (func as any)(context);
            if (!isValid)
                errors.push(new PropertyValidationError("general", name));
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