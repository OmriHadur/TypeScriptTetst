import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetResourceByIdRequest extends Request<any> {
    constructor(public api: ApiDefinition, public requestId: string) {
        super();
    }
}