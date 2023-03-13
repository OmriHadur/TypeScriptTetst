import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";


export default class CreateOrAlterResourceRequest extends Request<any> {
    entity?: any;

    constructor(
        public api: ApiDefinition,
        public isReplace: boolean,
        public resource: any) {
        super();
    }
}