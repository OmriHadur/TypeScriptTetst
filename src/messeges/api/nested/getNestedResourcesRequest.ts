import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetNestedResourcesRequest extends Request<any[]> {
    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ApiDefinition,
        public parentId: string) {
        super();
    }
}