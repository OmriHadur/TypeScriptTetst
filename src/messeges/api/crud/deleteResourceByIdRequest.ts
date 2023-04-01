import ApiDefinition from "../../../data/modules/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import ApiRequest from "../../../data/apiRequest";

export default class DeleteResourceByIdRequest extends ApiRequest<Unit> {
    constructor(public api: ApiDefinition, public resourceId: string) {
        super();
    }
}