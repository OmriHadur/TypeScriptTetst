import NotFoundError from "../../../Errors/notFoundError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetResourceByIdRequest from "../../../messeges/api/crud/getResourceByIdRequest";

export default class GetResourceByIdHandler
	implements IRequestHandler<GetResourceByIdRequest, any>
{
	messegeType = GetResourceByIdRequest.name;

	async handle(request: GetResourceByIdRequest): Promise<any | Error> {
		const entity = await request.api.module.findById(request.id);
		if (entity)
			return request.api.mapEntityToResource(entity);
		else
			return new NotFoundError(request.id);
	}
}
