import ApiContex from "../../data/apiContex"
import ApiDefinition from "../../data/modules/apiDefinition"
import Unit from "../../mediator/Data/unit"
import Request from "../../mediator/interfaces/request"


export default class AddApiMappingTaskReqeust extends Request<Unit> {
    constructor(public apiDefinitions: ApiDefinition[], public apiContex: ApiContex) {
        super();
    }
}