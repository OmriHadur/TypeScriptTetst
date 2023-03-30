import ApiError from "./apiError";

export default class ValidationError extends ApiError {
	constructor(error: any) {
		super(400, error);
	}
}