import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class AlterResourceRequest extends Request<any> {
    constructor(
        public api: ApiDefinition,
        public isReplace: boolean,
        public id: string,
        public resource: any) {
        super();
    }
}