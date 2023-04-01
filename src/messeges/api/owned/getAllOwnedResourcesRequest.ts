import ApiRequest from "../../../data/apiRequest";
import ApiDefinition from "../../../data/modules/apiDefinition";

export default class GetAllOwnedResourcesRequest extends ApiRequest<any[]> {
    constructor(public api: ApiDefinition) {
        super();
    }
}