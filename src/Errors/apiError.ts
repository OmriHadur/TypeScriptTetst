
export default class ApiError extends Error {
    status: number;
    errors: any[];

    constructor(status: number, errors: any[]) {
        super(JSON.stringify(errors));
        this.status = status;
        this.errors = errors;
    }
}