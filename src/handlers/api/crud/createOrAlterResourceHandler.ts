import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateOrAlterResourceRequest from "../../../messeges/api/crud/createOrAlterResourceRequest";

export default class CreateOrAlterResourceHandler implements IRequestHandler<CreateOrAlterResourceRequest, any> {
	messegeType = CreateOrAlterResourceRequest.name;

	async handle(request: CreateOrAlterResourceRequest, result: Result<any>): Promise<void> {
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
		result.value = await request.api.mapEntityToResource(entity);
	}
}
