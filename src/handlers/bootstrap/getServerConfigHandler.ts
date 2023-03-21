import ApiConfig from "../../data/input/apiConfig";
import ResourceConfig from "../../data/input/resourceConfig";
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

        const configs = folderFactory(request.configFolder);

        this.addData(configs, serverDefinitions);
        this.addApis(configs, serverDefinitions);
        result.value = serverDefinitions;
    }

    private addData(configs: any, serverDefinitions: ServerConfig) {
        for (let [name, file] of Object.entries(configs.data))
            serverDefinitions.data[name] = this.fileToConfig(file);
    }

    private addApis(configs: any, serverDefinitions: ServerConfig) {
        const ordered = Object.entries(configs.api).sort(([key]) => key.includes('.') ? 1 : -1);
        for (let [name, file] of ordered) {
            if (name.includes('.')) {
                const split = name.split('.');
                serverDefinitions.apis[split[0]].nested[split[1]] = this.fileToConfig(file);
            }
            else
                serverDefinitions.apis[name] = new ApiConfig(this.fileToConfig(file));
        }
    }

    fileToConfig(file: any): ResourceConfig {
        return { ...file } as ResourceConfig;
    }
}