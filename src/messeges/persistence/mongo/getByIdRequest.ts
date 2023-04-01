import Request from "../../../mediator/interfaces/request";

export default class GetByIdRequest extends Request<any> {
    constructor(
        public route: string,
        public entityId: string) {
        super();
    }
}