import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetResourcePropertyRequest extends Request<any> {
    constructor(
        public api: ApiDefinition,
        public requestId: string,
        public property: string) {
        super();
    }
}