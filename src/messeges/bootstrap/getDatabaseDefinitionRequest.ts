import ResourceConfig from "../../data/input/resourceConfig";
import DatabaseDefinition from "../../data/modules/databaseDefinition";
import Dictionary from "../../general/dictionary";
import Request from "../../mediator/Data/request";

export default class GetDatabaseDefinitionRequest extends Request<DatabaseDefinition> {
    constructor(public name: string, public resourceConfig: ResourceConfig, public schemesGetter: Dictionary<any>) {
        super();
    }
}