import ResourceConfig from "../../data/input/resourceConfig";
import ApiDefinition from "../../data/modules/apiDefinition";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Dictionary from "../../general/dictionary";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetResourceDefinitionRequest from "../../messeges/bootstrap/getResourceDefinitionRequest";
import GetServerDefinitionsRequest from "../../messeges/bootstrap/getServerDefinitionsRequest";

export default class GetServerDefinitionsHandler
    implements IRequestHandler<GetServerDefinitionsRequest, ServerDefinitions>
{
    messegeType = GetServerDefinitionsRequest.name;

    async handle(request: GetServerDefinitionsRequest, result: Result<ServerDefinitions>, mediator: IMediator): Promise<void> {
        const serverDefinitions = new ServerDefinitions();
        const scheme = new Dictionary<any>();
        for (let [name, dataConfig] of Object.entries(request.serverConfig.data)) {
            const resourceDefinition = await this.getResourceDefinition(mediator, scheme, name, dataConfig);
            serverDefinitions.datas.push(resourceDefinition);
        }

        for (let [name, apiConfig] of Object.entries(request.serverConfig.apis)) {
            const apiDefinition = await this.getResourceDefinition(mediator, scheme, name, apiConfig.input) as ApiDefinition;
            serverDefinitions.apis.push(apiDefinition);
            
            apiDefinition.nested = [];
            for (let [name, nestedConfig] of Object.entries(apiConfig.nested)) {
                const resourceDefinition = await this.getResourceDefinition(mediator, scheme, name, nestedConfig);
                apiDefinition.nested.push(resourceDefinition);
            }
        }

        result.value = serverDefinitions;
    }

    async getResourceDefinition(mediator: IMediator, scheme: Dictionary<any>, name: string, resourceConfig: ResourceConfig): Promise<ResourceDefinition> {
        return await mediator.sendValue(new GetResourceDefinitionRequest(name, resourceConfig, scheme)) as ResourceDefinition;
    }
}