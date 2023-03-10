import ApiDefinition from "../data/apiDefinition";
import Unit from "../mediator/Data/unit";
import IRequest from "../mediator/interfaces/request";

export default class DeleteResourceByIdRequest implements IRequest<Unit> {
    constructor(public api: ApiDefinition, public id: string) {
    }
}