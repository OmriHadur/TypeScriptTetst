import NotFoundError from "../Errors/notFoundError";
import Unit from "../mediator/Data/unit";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import DeleteResourceByIdRequest from "../messeges/deleteResourceByIdRequest";

export default class DeleteResourceByIdHandler
	implements IRequestHandler<DeleteResourceByIdRequest, Unit>
{
	messegeType = DeleteResourceByIdRequest.name;

	async handle(request: DeleteResourceByIdRequest): Promise<any | Error> {
		const found = await request.api.module.findByIdAndDelete(request.id);
		if (!found) return new NotFoundError(request.id);
	}
}
