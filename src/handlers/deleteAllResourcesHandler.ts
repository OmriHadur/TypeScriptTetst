import Result from "../mediator/Data/result";
import Unit from "../mediator/Data/unit";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import DeleteAllResourcesRequest from "../messeges/deleteAllResourcesRequest";

export default class CreateResourceHandler implements IRequestHandler<DeleteAllResourcesRequest, Unit>{
    messegeType = DeleteAllResourcesRequest.name;

    async handle(request: DeleteAllResourcesRequest, result: Result<Unit>): Promise<void> {
        await request.api.module.deleteMany();
        result.value = Unit.Instance;
    }
}