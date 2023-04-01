import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import ApiRequest from "../../../data/apiRequest";

export default class GetNestedResourcesRequest extends ApiRequest<any[]> {
    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string) {
        super();
    }
}