import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateOrAlterResourceRequest from "../../../messeges/createOrAlterResourceRequest";

export default class CreateOrAlterResourceHandler implements IRequestHandler<CreateOrAlterResourceRequest, any> {
	messegeType = CreateOrAlterResourceRequest.name;

	async handle(request: CreateOrAlterResourceRequest): Promise<any | Error> {
		let entity = request.entity;
		if (!entity) {
			const entityData = await request.api.mapCreateToEntity(request.resource);
			entity = new request.api.module(entityData);
		}
		else {
			const entityRepalce = await request.api.mapAlterToEntity(request.resource);
			Object.entries(entityRepalce).forEach(([key, value]) => {
				if (value || request.isReplace)
					entity[key] = value;
			});
		}
		entity = await entity.save();
		return request.api.mapEntityToResource(entity);
	}
}
