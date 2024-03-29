import ApiDefinition from "../../../data/modules/apiDefinition";
import ApiRequest from "../../../data/apiRequest";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourceRequest extends ApiRequest<any> {
    created: boolean = false;
    entityData?: any;
    entity?: any;
    isCreate: boolean;

    constructor(
        public api: ApiDefinition,
        public operation: AlterOperation,
        public resource: any,
        public resourceId?: string) {
        super();
        this.isCreate = (operation == AlterOperation.Create || operation == AlterOperation.ReplaceOrCreate);
    }
}