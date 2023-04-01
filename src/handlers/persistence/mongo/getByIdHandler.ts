import GetByIdRequest from "../../../messeges/persistence/mongo/getByIdRequest";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import { get } from "../../../general/static";
import ServerDefinitions from "../../../data/modules/serverDefinitions";

const definitions = () => get(ServerDefinitions.name) as ServerDefinitions;

export default class GetByIdHandler
    implements IRequestHandler<GetByIdRequest, any>
{
    messegeType = GetByIdRequest.name;

    async handle(request: GetByIdRequest, result: Result<any>) {
        const module = definitions().apisDic[request.route].database.module;
        result.value = await module.findById(request.entityId);
    }
}
