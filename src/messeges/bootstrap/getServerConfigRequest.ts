import ServerConfig from "../../data/input/serverConfig";
import Request from "../../mediator/Data/request";

export default class GetServerConfigRequest  extends Request<ServerConfig> {
    constructor(public configFolder: any) {
        super();
    }
}