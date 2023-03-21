import ApiContex from "../../data/apiContex"
import ServerConfig from "../../data/input/serverConfig";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Unit from "../../mediator/Data/unit";
import Request from "../../mediator/interfaces/request"


export default class AddValidationAndMappingRequest extends Request<Unit> {
    constructor(public serverDefinitions: ServerDefinitions, public serverConfig: ServerConfig, public apiContex: ApiContex) {
        super();
    }
}