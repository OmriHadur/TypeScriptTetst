import ApiDefinition from "../data/apiDefinition";
import PropertyValidationError from "../Errors/propertyValidationError";
import validationFactory from "../factories/validationFactory";
import * as apisContext from '../helpers/apisContext';
import * as scriptsBuilder from '../helpers/scriptsBuilder';

const validationsFunctions = validationFactory();

export default function (apiDefinitions: ApiDefinition[]) {
	apiDefinitions.forEach(apiDefinition => addApiValidation(apiDefinition));
}

function addApiValidation(apiDefinition: ApiDefinition) {
	const createAndAlterValidation = apiDefinition.validations.createAndAlter;
	const createAndAlterType = apiDefinition.types.createAndAlter;
	const alterType = apiDefinition.types.alter;
	apiDefinition.validateCreate = getValidation(createAndAlterValidation, createAndAlterType, true);

	const alterValidation = apiDefinition.validations.alter;

	apiDefinition.validateReplace = getValidation(alterValidation, alterType, true);
	apiDefinition.validateUpdate = getValidation(alterValidation, alterType, false);
}

function getValidation(validationDefinition: any, typeDefinition: any, isValidateUndefined: boolean) {
	const validationFunctions: any = {};
	const variables: any = {};
	for (let [propertyOrValidationName, value] of Object.entries(validationDefinition)) {
		const isProperty = typeDefinition[propertyOrValidationName] != null;
		if (isProperty)
			AddPropertyValidations(value, validationFunctions, isValidateUndefined, propertyOrValidationName);
		else if (propertyOrValidationName == 'variables') {
			for (let [variableName, variableScript] of Object.entries(value as any))
				variables[variableName] = getScriptFunction(variableScript as string);
		} else
			validationFunctions["resource." + propertyOrValidationName] = getScriptFunction(value as string);
	};
	return async (resource: any) => await validateResource(validationFunctions, variables, resource);
}

function AddPropertyValidations(propertyValidations: any, validationFunctions: any, isValidateUndefined: boolean, propertyName: string) {
	Object.entries(propertyValidations).forEach(([validationName, validationArg]) => {
		const validationFunction = validationsFunctions[validationName];
		const propertyValidationFunction = validationFunction ?
			getPropertyFunction(isValidateUndefined, propertyName, validationFunction, validationArg) :
			getScriptFunction(validationArg as string);
		validationFunctions[propertyName + "." + validationName] = propertyValidationFunction
	});
}

async function validateResource(validationFunctions: any, variables: any, resource: any) {
	const errors = [];
	const variablesValue: any = {};
	const context = { ...apisContext.get(), input: resource, variables: variablesValue };
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

function getPropertyFunction(isValidateUndefined: boolean, propertyName: string, validationFunction: any, validationArg: any) {
	return (context: any) => {
		if (!isValidateUndefined && !context.input[propertyName])
			return true;
		return validationFunction(context.input[propertyName], validationArg);
	};
}

function getScriptFunction(validationScript: string) {
	const script = scriptsBuilder.stringToScript(validationScript);
	return (context: any) => {
		return scriptsBuilder.runScript(script, context);
	};
}