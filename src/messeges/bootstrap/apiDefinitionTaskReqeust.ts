import ApiContex from "../../data/apiContex"
import ApiDefinition from "../../data/apiDefinition"
import Unit from "../../mediator/Data/unit"
import IRequest from "../../mediator/interfaces/request"


export default class ApiDefinitionTaskReqeust implements IRequest<Unit> {
    constructor(public apiDefinitions: ApiDefinition[], public apiContex: ApiContex) {
    }
}