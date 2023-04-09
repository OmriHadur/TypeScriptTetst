import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import ApiRequest from "../../../data/apiRequest";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterNestedResourceRequest extends ApiRequest<any> {
    parentEntity?: any;
    nestedEntities?: any[];
    entityData?: any;
    entity?: any;
    isCreate: boolean;

    constructor(
        public parentApi: ApiDefinition,
        public nestedApi: ResourceDefinition,
        public parentId: string,
        public resource: any,
        public operation: AlterOperation,
        public resourceId?: string) {
        super();
        this.isCreate = (operation == AlterOperation.Create || operation == AlterOperation.ReplaceOrCreate);
    }
}