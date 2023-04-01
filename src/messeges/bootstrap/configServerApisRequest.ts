import ServerDefinitions from "../../data/modules/serverDefinitions";
import Request from "../../mediator/Data/request";

export default class ConfigServerApisRequest extends Request<ServerDefinitions> {
    constructor(public configFolder: string, public distFolder: any) {
        super();
    }
}