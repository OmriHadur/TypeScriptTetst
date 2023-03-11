import NotFoundError from "../Errors/notFoundError";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../messeges/alterResourceRequest";

export default class AlterResourceHandler implements IRequestHandler<AlterResourceRequest, any> {
	messegeType = AlterResourceRequest.name;

	async handle(request: AlterResourceRequest): Promise<any> {
		let entity = await request.api.module.findById(request.id);
		if (!entity)
			return new NotFoundError(request.id);
		const entityRepalce = await request.api.mapAlterToEntity(request.resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (value || request.isReplace)
				entity[key] = value;
		});
		entity = await entity.save();
		return request.api.mapEntityToResource(entity);
	}
}
