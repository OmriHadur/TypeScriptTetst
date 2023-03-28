import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Request from "../../../mediator/interfaces/request";

export default class AlterNestedResourceRequest extends Request<any> {
    parentEntity?: any;
    nestedEntities?: any[];
    entityData?: any;
    entity?: any;

    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string,
        public resource: any,
        public resourceId?: string,
        public isOnlyUpdate: boolean = false) {
        super();
    }
}