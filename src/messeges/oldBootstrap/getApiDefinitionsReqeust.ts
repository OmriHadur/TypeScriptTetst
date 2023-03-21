import ResourceDefinition from "../../data/modules/resourceDefinition";
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/interfaces/request"


export default class GetApiDefinitionsReqeust extends Request<ResourceDefinition[]> {
    constructor(public files: Dictionary<any>) {
        super();
    }
}

