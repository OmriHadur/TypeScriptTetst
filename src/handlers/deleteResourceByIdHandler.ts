import NotFoundError from "../Errors/notFoundError";
import Result from "../mediator/Data/result";
import Unit from "../mediator/Data/unit";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import DeleteResourceByIdRequest from "../messeges/deleteResourceByIdRequest";

export default class DeleteResourceByIdHandler implements IRequestHandler<DeleteResourceByIdRequest, Unit>{
    messegeType = DeleteResourceByIdRequest.name;

    async handle(request: DeleteResourceByIdRequest, result: Result<any>): Promise<void> {
        const found = await request.api.module.findByIdAndDelete(request.id);
        if (!found)
            result.error = new NotFoundError(request.id);
        else
            result.value = Unit.Instance;
    }
}