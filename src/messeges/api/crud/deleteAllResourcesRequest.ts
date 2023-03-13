import ApiDefinition from "../../../data/apiDefinition";
import IRequest from "../../../mediator/interfaces/request";

export default class DeleteAllResourcesRequest implements IRequest<any> {
    constructor(public api: ApiDefinition) {
    }
}