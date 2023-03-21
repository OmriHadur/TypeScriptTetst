import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Request from "../../../mediator/interfaces/request";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterNestedResourceRequest extends Request<any> {
    parentEntity?: any;
    entity?: any;
    nestedEntities?: any[]

    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string,
        public operation: AlterOperation,
        public resource: any,
        public resourceId?: string) {
        super();
    }
}