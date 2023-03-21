import ServerConfig from "../../data/input/serverConfig";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Request from "../../mediator/interfaces/request"

export default class GetServerDefinitionsRequest extends Request<ServerDefinitions> {
    constructor(public serverConfig: ServerConfig) {
        super();
    }
}