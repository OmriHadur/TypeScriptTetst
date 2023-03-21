import ApiDefinition from "../../data/modules/apiDefinition"
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/interfaces/request"


export default class GetNestedApiDefinitionsReqeust extends Request<Dictionary<ApiDefinition[]>> {
    constructor(public apiFolder: Dictionary<any>, public dataSchemes: Dictionary<any>) {
        super();
    }
}

