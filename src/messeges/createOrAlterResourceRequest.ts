import ApiDefinition from "../data/apiDefinition";
import IRequest from "../mediator/interfaces/request";

export default class CreateOrAlterResourceRequest implements IRequest<any> {
    entity?: any;

    constructor(
        public api: ApiDefinition,
        public isReplace: boolean,
        public resource: any) {
    }
}