import ApiDefinition from "../../../data/modules/apiDefinition";
import ApiRequest from "../../../data/apiRequest";

export default class GetResourcePropertyRequest extends ApiRequest<any> {
    constructor(
        public api: ApiDefinition,
        public resourceId: string,
        public property: string) {
        super();
    }
}