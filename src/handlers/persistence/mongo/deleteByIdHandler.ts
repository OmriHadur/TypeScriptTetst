import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import { get } from "../../../general/static";
import ServerDefinitions from "../../../data/modules/serverDefinitions";
import DeleteByIdRequest from "../../../messeges/persistence/deleteByIdRequest";

const definitions = () => get(ServerDefinitions.name) as ServerDefinitions;

export default class DeleteByIdHandler
    implements IRequestHandler<DeleteByIdRequest, any>
{
    messegeType = DeleteByIdRequest.name;

    async handle(request: DeleteByIdRequest, result: Result<any>) {
        const module = definitions().apisDic[request.route].database.module;
        result.value = await module.findByIdAndDelete(request.entityId);
    }
}
