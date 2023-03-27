import ApiContex from "../../../data/apiContex";
import ValidationDefinition from "../../../data/modules/validationDefinition";
import ValidationError from "../../../Errors/validationError";
import { AlterOperation } from "../../../types/apiRelated";

export function getInputErrors(apiContex: ApiContex, operation: AlterOperation, validation: ValidationDefinition) {
    let errors = [];
    if (operation == AlterOperation.Create || operation == AlterOperation.ReplaceOrCreate)
        errors = validation.create.validateInput(apiContex);
    if (operation == AlterOperation.Update)
        errors = errors.concat(validation.update.validateInput(apiContex));
    else
        errors = errors.concat(validation.replace.validateInput(apiContex));
    return errors;
}

export async function getGeneralValidation(apiContex: ApiContex, operation: AlterOperation, validation: ValidationDefinition) {
    const validationDefinitions = getValidationDefinition(operation, validation);
    for (let validationDefinition of validationDefinitions) {
        await validationDefinition.calVariables(apiContex);
        const errors = await validationDefinition.validateGeneral(apiContex);
        if (errors.length > 0)
            return new ValidationError(errors);
    }
}

const getValidationDefinition = function* (operation: AlterOperation, validation: ValidationDefinition) {
    switch (operation) {
        case AlterOperation.Create:
        case AlterOperation.ReplaceOrCreate:
            yield validation.create;
            yield validation.replace;
            break;
        case AlterOperation.Replace:
            yield validation.replace;
        case AlterOperation.Update:
            yield validation.update;
    }
}