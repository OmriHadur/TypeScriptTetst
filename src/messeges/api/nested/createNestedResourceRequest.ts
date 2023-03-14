import ApiDefinition from "../../../data/apiDefinition";
import NestedRequest from "./nestedRequest";

export default class CreateNestedResourceRequest extends NestedRequest<any> {
    parentEntity?: any;
    
    constructor(
        parentApi: ApiDefinition,
        nestedApi: ApiDefinition,
        parentId: string,
        public resource: any) {
        super(parentApi, nestedApi, parentId);
    }
}