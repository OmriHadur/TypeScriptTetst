import ApiContex from "../../data/apiContex";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import PropertyValidationError from "../../Errors/propertyValidationError";
import GetValidationDefinitionRequest from "../../messeges/bootstrap/getValidationDefinitionRequest";
import Result from "../../mediator/Data/result";
import ValidationDefinition from "../../data/modules/validationDefinition";
import InputConfig from "../../data/input/inputConfig";
import Dictionary from "../../general/dictionary";
import ResourceValidationDefinition from "../../data/modules/resourceValidationDefinition";

export default class GetValidationDefinitionHandler
    implements IRequestHandler<GetValidationDefinitionRequest, ValidationDefinition>
{
    messegeType = GetValidationDefinitionRequest.name;

    async handle(request: GetValidationDefinitionRequest, result: Result<ValidationDefinition>): Promise<void> {
        const create = this.getValidation(request.resourceConfig.create);
        const alter = this.getValidation(request.resourceConfig.alter);
        result.value = new ValidationDefinition(create, alter);
    }

    getValidation(validationConfig: InputConfig): ResourceValidationDefinition {
        const propertiesValidation = this.getPropertiesValidation(validationConfig.input);
        const properties =
            (apiContex: ApiContex) => this.validateProperties(apiContex, propertiesValidation);

        const variablesFunctions = this.getFunctions(validationConfig.variables);
        const variables =
            (apiContex: ApiContex) => this.calcVariables(apiContex, variablesFunctions);

        const validationsFunctions = this.getFunctions(validationConfig.validations);
        const validations =
            async (apiContex: ApiContex) => this.getGeneralValidationErrors(apiContex, validationsFunctions);

        return new ResourceValidationDefinition(properties, variables, validations);
    }

    private getFunctions(functionsConfig: Dictionary<string>) {
        const functions = new Dictionary<any>;
        if (functionsConfig)
            for (let [name, script] of Object.entries(functionsConfig))
                functions[name] = this.getScriptFunction(script);
        return functions;
    }

    private async getGeneralValidationErrors(apiContex: ApiContex, validations: Dictionary<any>) {
        const errors: PropertyValidationError[] = [];
        for (let [name, func] of Object.entries(validations)) {
            const isValid = await (func as any)(apiContex);
            if (!isValid)
                errors.push(new PropertyValidationError("general", name));
        }
        return errors;
    }

    private async calcVariables(apiContex: ApiContex, variablesConfig: Dictionary<any>): Promise<void> {
        for (let [variablename, func] of Object.entries(variablesConfig)) {
            const value = await (func as any)(apiContex);
            apiContex.variables[variablename] = value;
        }
    }

    private getPropertiesValidation(input: Dictionary<any>): Dictionary<Dictionary<any>> {
        const propertiesValidation = new Dictionary<Dictionary<string>>();
        if (input)
            for (let [propertyName, value] of Object.entries(input))
                propertiesValidation[propertyName] = this.getPropertyValidation(value, propertyName);
        return propertiesValidation;
    }

    private getPropertyValidation(propertyValidations: any, propertyName: string): Dictionary<any> {
        const propertyValidation = new Dictionary<any>();
        if (this.isString(propertyValidations))
            propertyValidation[propertyValidations] = this.getPropertyFunction(propertyValidations, propertyName, {});
        else
            for (let [validationName, validationArg] of Object.entries(propertyValidations))
                propertyValidation[validationName] = this.getPropertyFunction(validationName, propertyName, validationArg);
        return propertyValidation;
    }

    private validateProperties(apiContex: ApiContex, propertiesValidation: Dictionary<Dictionary<any>>): PropertyValidationError[] {
        const errors: PropertyValidationError[] = [];
        for (let [propertyName, validations] of Object.entries(propertiesValidation))
            for (let [validationName, validationsFunc] of Object.entries(validations))
                if (!validationsFunc(apiContex))
                    errors.push(new PropertyValidationError(propertyName, validationName));
        return errors;
    }

    private getPropertyFunction(validationName: string, propertyName: string, validationArg: any) {
        return (context: ApiContex) => {
            if (!context.isValidateUndefined && !context.input[propertyName])
                return true;
            const validationFunction = context.validations[validationName];
            return validationFunction(context.input[propertyName], validationArg);
        };
    }

    private getScriptFunction(validationScript: string) {
        const script = scriptsBuilder.stringToScript(validationScript);
        return (context: any) => {
            return scriptsBuilder.runScript(script, context);
        };
    }

    private isString(obj: any): obj is string {
        return typeof obj === "string";
    }
}