import ApiContex from "../../data/apiContex";
import ServerConfig from "../../data/input/serverConfig";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import ConfigServerApisRequest from "../../messeges/bootstrap/configServerApisRequest";
import GetApiContexReqeust from "../../messeges/bootstrap/getApiContexReqeust";
import GetServerConfigRequest from "../../messeges/bootstrap/getServerConfigRequest";
import GetServerDefinitionsRequest from "../../messeges/bootstrap/getServerDefinitionsRequest";
import * as sendToMediator from '../../controllers/sendToMediator';
import Dictionary from "../../general/dictionary";
import GetServerSchemesRequests from "../../messeges/bootstrap/getServerDatabaseDefinitionsRequest";
import AddToDefinitionsRequest from "../../messeges/bootstrap/addToDefinitionsRequest";

export default class ConfigServerApisHandler
    implements IRequestHandler<ConfigServerApisRequest, ServerDefinitions>
{
    messegeType = ConfigServerApisRequest.name;

    async handle(request: ConfigServerApisRequest, result: Result<ServerDefinitions>, mediator: IMediator): Promise<void> {
        const serverConfig = await mediator.sendValue(new GetServerConfigRequest(request.configFolder)) as ServerConfig;
        const schemes = mediator.sendSync(new GetServerSchemesRequests(serverConfig)).value as Dictionary<any>;
        const serverDefinitions = mediator.sendSync(new GetServerDefinitionsRequest(serverConfig, schemes)).value as ServerDefinitions;
        await mediator.sendValue(new AddToDefinitionsRequest(serverDefinitions, serverConfig));
        const apiContex = await mediator.sendValue(new GetApiContexReqeust(serverDefinitions.apis, request.distFolder)) as ApiContex;
        sendToMediator.setApiContex(apiContex);
        result.value = serverDefinitions;
    }
}