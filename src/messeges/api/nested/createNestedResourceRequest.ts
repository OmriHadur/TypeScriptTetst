import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Request from "../../../mediator/interfaces/request";

export default class CreateNestedResourceRequest extends Request<any> {
    parentEntity?: any;
    nestedEntities?: any[];
    entityData?: any;
    entity?: any;

    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string,
        public resource: any,
        public onlyCreate: boolean) {
        super();
    }
}