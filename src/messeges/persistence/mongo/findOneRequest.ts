import Request from "../../../mediator/interfaces/request";

export default class FindOneRequest extends Request<any> {
    constructor(
        public route: string,
        public predicate: string) {
        super();
    }
}