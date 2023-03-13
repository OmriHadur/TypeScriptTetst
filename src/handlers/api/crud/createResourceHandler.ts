import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../../../messeges/createResourceRequest";

export default class CreateResourceHandler implements IRequestHandler<CreateResourceRequest, any> {
	messegeType = CreateResourceRequest.name;

	async handle(request: CreateResourceRequest): Promise<any | Error> {
		const entityData = await request.api.mapCreateToEntity(request.resource);
		let entity = new request.api.module(entityData);
		entity = await entity.save();
		return request.api.mapEntityToResource(entity);
	}
}
