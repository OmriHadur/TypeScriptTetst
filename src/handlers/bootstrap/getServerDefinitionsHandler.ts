import ServerDefinitions from "../../data/modules/serverDefinitions";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetServerDefinitionsRequest from "../../messeges/bootstrap/getServerDefinitionsRequest";

export default class GetServerDefinitionsHandler
    implements IRequestHandler<GetServerDefinitionsRequest, ServerDefinitions>
{
    messegeType = GetServerDefinitionsRequest.name;

    async handle(request: GetServerDefinitionsRequest, result: Result<ServerDefinitions>): Promise<void> {
        const serverDefinitions = new ServerDefinitions();

        result.value = serverDefinitions;
    }
}