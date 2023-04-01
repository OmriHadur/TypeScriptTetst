import ApiDefinition from "../../../data/modules/apiDefinition";
import ApiRequest from "../../../data/apiRequest";

export default class GetAllResourcesRequest extends ApiRequest<any[]> {
    constructor(public api: ApiDefinition) {
        super();
    }
}