import ApiContex from "../../data/apiContex"
import ApiDefinition from "../../data/apiDefinition"
import Dictionary from "../../general/dictionary"
import IRequest from "../../mediator/interfaces/request"


export default class GetApiContexReqeust implements IRequest<ApiContex> {
    constructor(public apiDefinitions: ApiDefinition[], public functionsFolder: Dictionary<any>) {
    }
}