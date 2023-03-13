import ApiContex from "../../data/apiContex"
import ApiDefinition from "../../data/apiDefinition"
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/interfaces/request"

export default class GetApiContexReqeust extends Request<ApiContex> {
    constructor(public apiDefinitions: ApiDefinition[], public functionsFolder: Dictionary<any>) {
        super();
    }
}