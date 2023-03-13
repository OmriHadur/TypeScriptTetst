import ApiDefinition from "../../../data/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import IRequest from "../../../mediator/interfaces/request";

export default class DeleteAllResourcesRequest implements IRequest<Unit> {
    constructor(public api: ApiDefinition) {
    }
}