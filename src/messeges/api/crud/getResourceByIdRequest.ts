import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetResourceByIdRequest extends Request<any> {
    constructor(public api: ApiDefinition, public id: string) {
        super();
    }
}