import ApiDefinition from "../../../data/apiDefinition";
import IRequest from "../../../mediator/interfaces/request";


export default class CreateResourceRequest implements IRequest<any> {
    constructor(
        public api: ApiDefinition,
        public resource: any) {
    }
}