import apiError from "./apiError";

export default class InternalError extends apiError {
	constructor(messege: string) {
		super(500, [messege]);
	}
}