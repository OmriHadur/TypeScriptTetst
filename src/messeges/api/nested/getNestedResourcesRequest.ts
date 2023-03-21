import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetNestedResourcesRequest extends Request<any[]> {
    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string) {
        super();
    }
}