import ApiDefinition from "../../../data/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/interfaces/request";

export default class DeleteAllResourcesRequest extends Request<Unit> {
    constructor(public api: ApiDefinition) {
        super();
    }
}