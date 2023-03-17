import ApiDefinition from "../../../data/apiDefinition";
import Request from "../../../mediator/interfaces/request";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterNestedResourceRequest extends Request<any> {
    parentEntity?: any;
    entity?: any;
    nestedEntities?: any[]

    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ApiDefinition,
        public parentId: string,
        public operation: AlterOperation,
        public resource: any,
        public resourceId?: string) {
        super();
    }
}