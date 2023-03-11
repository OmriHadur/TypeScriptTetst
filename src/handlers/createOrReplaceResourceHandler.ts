import IRequestHandler from "../mediator/interfaces/requestHandler";
import CreateOrReplaceResourceRequest from "../messeges/createOrReplaceResourceRequest";

export default class CreateOrReplaceResourceHandler implements IRequestHandler<CreateOrReplaceResourceRequest, any> {
	messegeType = CreateOrReplaceResourceRequest.name;

	async handle(request: CreateOrReplaceResourceRequest): Promise<any | Error> {
		let entity = request.entity;
		if (!entity) {
			const entityData = await request.api.mapCreateToEntity(request.resource);
			entity = new request.api.module(entityData);
		}
		else {
			const entityRepalce = await request.api.mapAlterToEntity(request.resource);
			Object.entries(entityRepalce).forEach(([key, value]) => {
				if (value)
					entity[key] = value;
			});
		}
		entity = await entity.save();
		return request.api.mapEntityToResource(entity);
	}
}
