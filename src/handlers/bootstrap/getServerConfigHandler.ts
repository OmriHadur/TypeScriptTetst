import ServerConfig from "../../data/input/serverConfig";
import folderFactory from "../../factories/folderFactory";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetServerConfigRequest from "../../messeges/bootstrap/getServerConfigRequest";

export default class GetServerConfigHandler
    implements IRequestHandler<GetServerConfigRequest, ServerConfig>
{
    messegeType = GetServerConfigRequest.name;

    async handle(request: GetServerConfigRequest, result: Result<ServerConfig>): Promise<void> {
        const serverDefinitions = new ServerConfig();

        const configs = folderFactory("Configs/");

        result.value = serverDefinitions;
    }
}