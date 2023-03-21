import ApiDefinition from "../../data/modules/apiDefinition"
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/interfaces/request"


export default class GetApiDefinitionReqeust extends Request<ApiDefinition> {
    constructor(public apiJsonDefinition: any, public route: string, public dataSchemes: Dictionary<any>) {
        super();
    }
}

