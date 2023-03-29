import ResourceConfig from "../../data/input/resourceConfig";
import DatabaseDefinition from "../../data/modules/databaseDefinition";
import Dictionary from "../../general/dictionary";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import ISyncRequestHandler from "../../mediator/interfaces/syncRequestHandler";
import GetDatabaseDefinitionRequest from "../../messeges/bootstrap/getDatabaseDefinitionRequest";
import GetServerDatabaseDefinitionsRequest from "../../messeges/bootstrap/getServerDatabaseDefinitionsRequest";

export default class GetServerSchemesHandler
    implements ISyncRequestHandler<GetServerDatabaseDefinitionsRequest, Dictionary<DatabaseDefinition>>
{
    messegeType = GetServerDatabaseDefinitionsRequest.name;

    handle(request: GetServerDatabaseDefinitionsRequest, result: Result<Dictionary<DatabaseDefinition>>, mediator: IMediator): void {
        const databaseDefinitions = new Dictionary<DatabaseDefinition>();
        const DatabaseDefinitionssGetter = new Dictionary<any>();
        for (let [name, dataConfig] of Object.entries(request.serverConfig.data))
            this.set(mediator, name, databaseDefinitions, DatabaseDefinitionssGetter, dataConfig);

        for (let [apiName, apiConfig] of Object.entries(request.serverConfig.apis)) {
            this.set(mediator, apiName, databaseDefinitions, DatabaseDefinitionssGetter, apiConfig.input);
            for (let [nestedName, nestedConfig] of Object.entries(apiConfig.nested))
                this.set(mediator, nestedName, databaseDefinitions, DatabaseDefinitionssGetter, nestedConfig);
        }

        for (let [, getter] of Object.entries(DatabaseDefinitionssGetter))
            getter();
        result.value = databaseDefinitions;
    }

    set(mediator: IMediator, name: string, databaseDefinitions: Dictionary<DatabaseDefinition>, DatabaseDefinitionssGetter: Dictionary<any>, resourceConfig: ResourceConfig) {
        DatabaseDefinitionssGetter[name] = () => {
            if (databaseDefinitions[name])
                return databaseDefinitions[name];
            const scheme = mediator.sendSync(new GetDatabaseDefinitionRequest(name, resourceConfig, DatabaseDefinitionssGetter)).value;
            databaseDefinitions[name] = scheme as DatabaseDefinition;
            return scheme;
        }
    }
}