import ApiContex from "../../../data/apiContex";
import ValidationDefinition from "../../../data/modules/validationDefinition";
import { AlterOperation } from "../../../types/apiRelated";

export function validateInput(apiContex: ApiContex, operation: AlterOperation, validation: ValidationDefinition) {
    let errors: any[] = [];
    if (operation == AlterOperation.Create || operation == AlterOperation.ReplaceOrCreate)
        errors = errors.concat(validation.create.validateInput(apiContex));
    const validationDefinition = operation == AlterOperation.Update ? validation.update : validation.replace;
    errors = errors.concat(validationDefinition.validateInput(apiContex));
    return errors;
}