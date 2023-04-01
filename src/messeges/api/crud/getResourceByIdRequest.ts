import ApiDefinition from "../../../data/modules/apiDefinition";
import ApiRequest from "../../../data/apiRequest";

export default class GetResourceByIdRequest extends ApiRequest<any> {
    constructor(public api: ApiDefinition, public resourceId: string) {
        super();
    }
}