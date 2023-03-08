import ApiError from "./apiError";
import PropertyValidationError from "./propertyValidationError";

export default class ValidationError extends ApiError {
    constructor(errors: PropertyValidationError[]) {
        const groupedErrors = errors.reduce((group: any, error: any) => {
            const propertyName = error.propertyName;
            group[propertyName] = group[propertyName] ?? [];
            group[propertyName].push(error.validationName);
            return group;
        }, {});
        super(400, groupedErrors);
    }
}