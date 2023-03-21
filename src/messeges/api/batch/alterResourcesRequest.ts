import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/interfaces/request";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourcesRequest extends Request<any> {
    entities: any[];

    constructor(
        public api: ApiDefinition,
        public operation: AlterOperation,
        public resources: any[],
        public resourcesId?: string[]) {
        super();
        this.entities = [];
    }
}