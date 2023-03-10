import ApiDefinition from "../data/apiDefinition";
import IRequest from "../mediator/interfaces/request";

export default class AlterResourceRequest implements IRequest<any> {
    constructor(
        public api: ApiDefinition,
        public isReplace: boolean,
        public id: string,
        public resource: any) {
    }
}