import ApiDefinition from "../../../data/modules/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/interfaces/request";

export default class DeleteResourceByIdRequest extends Request<Unit> {
    constructor(public api: ApiDefinition, public requestId: string) {
        super();
    }
}