import ApiDefinition from "../../data/apiDefinition"
import Dictionary from "../../general/dictionary"
import IRequest from "../../mediator/interfaces/request"


export default class GetResourceByIdRequest implements IRequest<ApiDefinition[]> {
    constructor(public apiFolder: Dictionary<any>, public schemes: Dictionary<any>) {
    }
}

