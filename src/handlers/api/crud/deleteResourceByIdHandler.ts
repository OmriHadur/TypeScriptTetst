import NotFoundError from "../../../Errors/notFoundError";
import Result from "../../../mediator/Data/result";
import Unit from "../../../mediator/Data/unit";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import DeleteResourceByIdRequest from "../../../messeges/api/crud/deleteResourceByIdRequest";

export default class DeleteResourceByIdHandler
	implements IRequestHandler<DeleteResourceByIdRequest, Unit>
{
	messegeType = DeleteResourceByIdRequest.name;

	async handle(request: DeleteResourceByIdRequest, result: Result<Unit>): Promise<void> {
		const found = await request.api.module.findByIdAndDelete(request.requestId);
		if (!found)
			result.error = new NotFoundError(request.requestId);
	}
}
