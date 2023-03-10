import ApiError from "./apiError";

export default class PropertyValidationError extends ApiError {
	propertyName: string;
	validationName: string;
	constructor(propertyName: string, validationName: string) {
		super(400, []);
		this.propertyName = propertyName;
		this.validationName = validationName;
	}
}