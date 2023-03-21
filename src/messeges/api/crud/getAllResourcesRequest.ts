import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetAllResourcesRequest extends Request<any[]> {
    constructor(public api: ApiDefinition) {
        super();
    }
}