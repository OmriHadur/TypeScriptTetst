import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetAllOwnedResourcesRequest extends Request<any[]> {
    constructor(public api: ApiDefinition) {
        super();
    }
}