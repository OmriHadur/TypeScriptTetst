import ResourceConfig from "../../data/input/resourceConfig";
import ApiDefinition from "../../data/modules/apiDefinition";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Dictionary from "../../general/dictionary";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import ISyncRequestHandler from "../../mediator/interfaces/syncRequestHandler";
import GetResourceDefinitionRequest from "../../messeges/bootstrap/getResourceDefinitionRequest";
import GetServerDefinitionsRequest from "../../messeges/bootstrap/getServerDefinitionsRequest";

export default class GetServerDefinitionsHandler
    implements ISyncRequestHandler<GetServerDefinitionsRequest, ServerDefinitions>
{
    messegeType = GetServerDefinitionsRequest.name;

    handle(request: GetServerDefinitionsRequest, result: Result<ServerDefinitions>, mediator: IMediator): void {
        const serverDefinitions = new ServerDefinitions();

        for (let [name, dataConfig] of Object.entries(request.serverConfig.data)) {
            const resourceDefinition = this.getResourceDefinition(mediator, request.schemes, name, dataConfig);
            serverDefinitions.datas.push(resourceDefinition);
        }

        for (let [name, apiConfig] of Object.entries(request.serverConfig.apis)) {
            const apiDefinition = this.getResourceDefinition(mediator, request.schemes, name, apiConfig.input) as ApiDefinition;
            serverDefinitions.apis.push(apiDefinition);

            apiDefinition.nested = [];
            for (let [name, nestedConfig] of Object.entries(apiConfig.nested)) {
                const resourceDefinition = this.getResourceDefinition(mediator, request.schemes, name, nestedConfig);
                apiDefinition.nested.push(resourceDefinition);
            }
        }

        result.value = serverDefinitions;
    }

    getResourceDefinition(mediator: IMediator, scheme: Dictionary<any>, name: string, resourceConfig: ResourceConfig): ResourceDefinition {
        return mediator.sendSync(new GetResourceDefinitionRequest(name, resourceConfig, scheme)).value as ResourceDefinition;
    }
}