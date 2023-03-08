import PropertyValidationError from "../Errors/propertyValidationError";
import validationFactory from "../factories/validationFactory";
import * as apisContext from '../helpers/apisContext';
import * as scriptsBuilder from '../helpers/scriptsBuilder';

const validationsFunctions = validationFactory();

export default function (apiDefinitions: any[]) {
    apiDefinitions.forEach(apiDefinition => addApiValidation(apiDefinition));
}

function addApiValidation(apiDefinition: any) {
    const createValidation = apiDefinition.validations.create;
    apiDefinition.validateCreate = getValidation(createValidation, true);

    const alterValidation = apiDefinition.validations.alter;
    apiDefinition.validateReplace = getValidation(alterValidation, true);
    apiDefinition.validateUpdate = getValidation(alterValidation, false);
}

function getValidation(validationDefinition: any, isValidateUndefined: any) {
    const validationFunctions = {};
    Object.entries(validationDefinition).forEach(([propertyName, propertyValidations]) =>
        AddPropertyValidations(propertyValidations, validationFunctions, isValidateUndefined, propertyName));
    return async (resource: any) => await getErrors(validationFunctions, resource);
}

async function getErrors(validationFunctions: any, resource: any) {
    const errors = [];
    for (let [validationName, func] of Object.entries(validationFunctions)) {
        const isValid = await (func as any)(resource);
        if (!isValid) {
            const split = validationName.split('.');
            errors.push(new PropertyValidationError(split[0], split[1]));
        }
    }
    return errors;
}

function AddPropertyValidations(propertyValidations: any, validationFunctions: any, isValidateUndefined: any, propertyName: any) {
    Object.entries(propertyValidations).forEach(([validationName, validationArg]) => {
        const validationFunction = validationsFunctions[validationName];
        const propertyValidationFunction = validationFunction ?
            getPropertyFunction(isValidateUndefined, propertyName, validationFunction, validationArg) :
            getScriptFunction(validationArg);
        validationFunctions[propertyName + "." + validationName] = propertyValidationFunction
    });
}

function getPropertyFunction(isValidateUndefined: any, propertyName: any, validationFunction: any, validationArg: any) {
    return (input: any) => {
        if (!isValidateUndefined && !input[propertyName])
            return true;
        return validationFunction(input[propertyName], validationArg);
    };
}

function getScriptFunction(validationScript: any) {
    const script = scriptsBuilder.stringToScript(validationScript);
    return (input: any) => {
        const scriptContext = { ...apisContext.get(), input: input };
        return scriptsBuilder.runScript(script, scriptContext);
    };
}