import ApiContex from "../../data/apiContex";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import PropertyValidationError from "../../errors/propertyValidationError";
import GetValidationDefinitionRequest from "../../messeges/bootstrap/getValidationDefinitionRequest";
import Result from "../../mediator/Data/result";
import ValidationDefinition from "../../data/modules/validationDefinition";
import InputConfig from "../../data/input/inputConfig";
import Dictionary from "../../general/dictionary";
import ResourceValidationDefinition from "../../data/modules/resourceValidationDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";

export default class GetValidationDefinitionHandler
    implements IRequestHandler<GetValidationDefinitionRequest, ValidationDefinition>
{
    messegeType = GetValidationDefinitionRequest.name;

    async handle(request: GetValidationDefinitionRequest, result: Result<ValidationDefinition>): Promise<void> {
        const create = this.getValidation(request.resourceConfig.create, true, request.server);
        const alter = this.getValidation(request.resourceConfig.alter, false, request.server);
        result.value = new ValidationDefinition(create, alter);
    }

    getValidation(validationConfig: InputConfig, isCreate: boolean, server: ServerDefinitions): ResourceValidationDefinition {
        const propertiesValidation = this.getPropertiesValidation(validationConfig.input, isCreate, server);
        const properties =
            (apiContex: ApiContex, isValidateUndefined: boolean) =>
                this.validateProperties(apiContex, propertiesValidation, isValidateUndefined);

        const variablesFunctions = this.getFunctions(validationConfig.variables);
        const validationsFunctions = this.getFunctions(validationConfig.validations);
        const validations =
            async (apiContex: ApiContex) => {
                await this.calcVariables(apiContex, variablesFunctions);
                return this.getGeneralValidationErrors(apiContex, validationsFunctions)
            };

        return new ResourceValidationDefinition(properties, validations);
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

    private getPropertiesValidation(input: Dictionary<any>, isCreate: boolean, server: ServerDefinitions): Dictionary<Dictionary<any>> {
        const propertiesValidation = new Dictionary<Dictionary<string>>();
        if (input)
            for (let [propertyName, value] of Object.entries(input))
                propertiesValidation[propertyName] = this.getPropertyValidation(value, propertyName, isCreate, server);
        return propertiesValidation;
    }

    private getPropertyValidation(propertyValidations: any, propertyName: string, isCreate: boolean, server: ServerDefinitions): Dictionary<any> {
        const propertyValidation = new Dictionary<any>();
        if (this.isString(propertyValidations))
            propertyValidation[propertyValidations] = this.getPropertyFunction(propertyValidations, propertyName, {});
        else
            for (let [validationName, validationArg] of Object.entries(propertyValidations)) {
                if (validationName == 'type') {
                    propertyValidation[validationName] = this.getDataFunction(server, validationArg, isCreate, propertyName);
                } else
                    propertyValidation[validationName] = this.getPropertyFunction(validationName, propertyName, validationArg);
            }
        return propertyValidation;
    }

    private getDataFunction(server: ServerDefinitions, validationArg: unknown, isCreate: boolean, propertyName: string) {
        const config = server.datas.find(d => d.name == validationArg)!;
        const validation = isCreate ? config.validation.create : config.validation.alter;
        return (context: ApiContex, isValidateUndefined: boolean) => {
            const input = context.input;
            if (!input[propertyName])
                return true;
            context.input = input[propertyName];
            const result = validation.validateInput(context, isValidateUndefined);
            context.input = input;
            return result;
        };
    }

    private validateProperties(apiContex: ApiContex, propertiesValidation: Dictionary<Dictionary<any>>, isValidateUndefined: boolean) {
        const errors: any = {};
        for (let [propertyName, validations] of Object.entries(propertiesValidation)) {
            for (let [validationName, validationsFunc] of Object.entries(validations)) {
                const result = validationsFunc(apiContex, isValidateUndefined);
                if (result == false || (result && Object.keys(result).length > 0)) {
                    if (!errors[propertyName])
                        errors[propertyName] = {};
                    if (Object.keys(result).length > 0)
                        errors[propertyName] = { ...errors[propertyName], ...result };
                    else
                        errors[propertyName][validationName] = false;
                }
            }
        }
        return errors;
    }

    private getPropertyFunction(validationName: string, propertyName: string, validationArg: any) {
        return (context: ApiContex, isValidateUndefined: boolean) => {
            if (!isValidateUndefined && !context.input[propertyName])
                return true;
            const validationFunction = context.validations[validationName];
            if (!validationFunction)
                throw new Error(validationName + " is not a function");
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