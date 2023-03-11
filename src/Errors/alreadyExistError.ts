import apiError from "./apiError";

export default class AlreadyExistError extends apiError {
	constructor() {
		super(400, ["Resource already exist"]);
	}
}