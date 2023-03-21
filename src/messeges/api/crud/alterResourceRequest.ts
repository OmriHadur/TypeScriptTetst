import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourceRequest extends Request<any> {
    entity?: any;

    constructor(
        public api: ApiDefinition,
        public operation: AlterOperation,
        public resource: any,
        public resourceId?: string) {
        super();
    }
}