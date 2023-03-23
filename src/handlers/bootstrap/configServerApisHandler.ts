import ApiContex from "../../data/apiContex";
import ServerConfig from "../../data/input/serverConfig";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import AddValidationAndMappingRequest from "../../messeges/bootstrap/AddValidationAndMappingRequest";
import ConfigServerApisRequest from "../../messeges/bootstrap/configServerApisRequest";
import GetApiContexReqeust from "../../messeges/bootstrap/getApiContexReqeust";
import GetServerConfigRequest from "../../messeges/bootstrap/getServerConfigRequest";
import GetServerDefinitionsRequest from "../../messeges/bootstrap/getServerDefinitionsRequest";
import * as sendToMediator from '../../controllers/sendToMediator';

export default class ConfigServerApisHandler
    implements IRequestHandler<ConfigServerApisRequest, ServerDefinitions>
{
    messegeType = ConfigServerApisRequest.name;

    async handle(request: ConfigServerApisRequest, result: Result<ServerDefinitions>, mediator: IMediator): Promise<void> {
        const serverConfig = await mediator.sendValue(new GetServerConfigRequest(request.configFolder)) as ServerConfig;
        const serverDefinitions = await mediator.sendValue(new GetServerDefinitionsRequest(serverConfig)) as ServerDefinitions;
        await mediator.sendValue(new AddValidationAndMappingRequest(serverDefinitions, serverConfig));
        const apiContex = await mediator.sendValue(new GetApiContexReqeust(serverDefinitions.apis, request.distFolder)) as ApiContex;
        sendToMediator.setApiContex(apiContex);
        result.value = serverDefinitions;
    }
}