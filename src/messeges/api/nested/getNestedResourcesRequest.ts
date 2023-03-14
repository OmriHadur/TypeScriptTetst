import ApiDefinition from "../../../data/apiDefinition";
import NestedRequest from "./nestedRequest";

export default class GetNestedResourcesRequest extends NestedRequest<any[]> {
    constructor(
        parentApi: ApiDefinition,
        nestedApi: ApiDefinition,
        parentId: string) {
        super(parentApi, nestedApi, parentId);
    }
}