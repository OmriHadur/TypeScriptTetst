import ApiDefinition from "../data/apiDefinition";
import IRequest from "../mediator/interfaces/request";

export default class CreateOrReplaceResourceRequest implements IRequest<any> {
    entity?: any;

    constructor(
        public api: ApiDefinition,
        public resource: any) {
    }
}