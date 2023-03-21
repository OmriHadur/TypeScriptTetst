import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetResourcePropertyRequest extends Request<any> {
    constructor(
        public api: ApiDefinition,
        public requestId: string,
        public property: string) {
        super();
    }
}