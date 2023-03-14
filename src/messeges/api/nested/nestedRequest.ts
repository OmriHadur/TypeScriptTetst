import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class NestedRequest<TValue> extends Request<TValue> {
    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ApiDefinition,
        public parentId: string) {
        super();
    }
}