import ApiRequest from "../../../data/apiRequest";
import ApiDefinition from "../../../data/modules/apiDefinition";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourcesRequest extends ApiRequest<any> {
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