import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";

export default class GetExistingNestedEntityReqeust extends Request<any> {
    constructor(
        public nestedEntities: any[],
        public nestedApi: ApiDefinition,
        public nestedEntity: any) {
        super();
    }
}