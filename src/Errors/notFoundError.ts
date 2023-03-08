import apiError from "./apiError";

export default class ValidationError extends apiError {
    constructor(id: string) {
        super(404, [`Resource {id} Not found`]);
    }
}