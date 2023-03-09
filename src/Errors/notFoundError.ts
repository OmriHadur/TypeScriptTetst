import apiError from "./apiError";

export default class NotFoundError extends apiError {
    constructor(id: string) {
        super(404, ["Resource with id: " + id + " Not found"]);
    }
}