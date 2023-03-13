import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";


export default class CreateResourceRequest extends Request<any> {
    constructor(
        public api: ApiDefinition,
        public resource: any) {
        super();
    }
}