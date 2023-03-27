import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourceRequest extends Request<any> {
    created: boolean = false;
    
    constructor(
        public api: ApiDefinition,
        public operation: AlterOperation,
        public resource: any,
        public resourceId?: string) {
        super();
    }
}