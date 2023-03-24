import ApiContex from "../../../data/apiContex";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import ValidationError from "../../../Errors/validationError";
import { AlterOperation } from "../../../types/apiRelated";

export default async function (apiContex: ApiContex, definition: ResourceDefinition, operation: AlterOperation, input: any) {
    for (let validator of getValidators(operation, definition)) {
        const errors = await validator(apiContex, input);
        if (errors.length > 0)
            return new ValidationError(errors);
    }
}

const getValidators = function* getValidators(operation: AlterOperation, definition: ResourceDefinition) {
    switch (operation) {
        case AlterOperation.Create:
        case AlterOperation.ReplaceOrCreate:
            yield definition.validation.create;
            yield definition.validation.replace;
            break;
        case AlterOperation.Replace:
            yield definition.validation.replace;
        case AlterOperation.Update:
            yield definition.validation.update;
    }
}