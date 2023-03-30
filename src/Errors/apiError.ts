
export default class ApiError extends Error {
	status: number;
	error: any;

	constructor(status: number, error: any) {
		super(JSON.stringify(error));
		this.status = status;
		this.error = error;
	}
}