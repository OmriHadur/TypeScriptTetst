import ApiDefinition from "../../data/apiDefinition"
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/interfaces/request"


export default class GetApiDefinitionsReqeust extends Request<ApiDefinition[]> {
    constructor(public apiFolder: Dictionary<any>, public schemes: Dictionary<any>) {
        super();
    }
}

