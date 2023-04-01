import Request from "../../../mediator/interfaces/request";

export default class DeleteByIdRequest extends Request<any> {
    constructor(
        public route: string,
        public entityId: string) {
        super();
    }
}