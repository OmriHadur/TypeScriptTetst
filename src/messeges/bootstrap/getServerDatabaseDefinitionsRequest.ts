import ServerConfig from "../../data/input/serverConfig";
import DatabaseDefinition from "../../data/modules/databaseDefinition";
import Dictionary from "../../general/dictionary";
import Request from "../../mediator/interfaces/request"

export default class GetServerDatabaseDefinitionsRequest extends Request<Dictionary<DatabaseDefinition>> {
    constructor(public serverConfig: ServerConfig) {
        super();
    }
}