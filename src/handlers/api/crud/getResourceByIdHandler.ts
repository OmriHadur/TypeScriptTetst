import NotFoundError from "../../../errors/notFoundError";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetResourceByIdRequest from "../../../messeges/api/crud/getResourceByIdRequest";

export default class GetResourceByIdHandler
	implements IRequestHandler<GetResourceByIdRequest, any>
{
	messegeType = GetResourceByIdRequest.name;

	async handle(request: GetResourceByIdRequest, result: Result<any>): Promise<void> {
		const entity = await request.api.database.module.findById(request.requestId);
		if (entity)
			result.value = await request.api.mapping.entityToResource(request.apiContex, entity);
		else
			result.error = new NotFoundError(request.requestId);
	}
}
