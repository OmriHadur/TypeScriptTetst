import Result from "../../../mediator/Data/result";
import IMediator from "../../../mediator/interfaces/mediator";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterNestedResourcesHandler implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async handle(request: AlterNestedResourceRequest, result: Result<any>, mediator: IMediator): Promise<void> {
		let entity = request.entity;

		if (this.isShouldCreate(request)) {
			entity = await this.create(request);
			request.nestedEntities!.push(entity);
		}
		await this.alter(request, entity);

		await request.parentEntity.save();
		result.value = await request.parentApi.mapping.entityToResource(request.user, request.parentEntity);
	}

	private isShouldCreate(request: AlterNestedResourceRequest) {
		return request.operation == AlterOperation.Create || (request.operation == AlterOperation.ReplaceOrCreate && !request.entity);
	}

	private async create(request: AlterNestedResourceRequest) {
		const entityData = await request.nestedApi.mapping.createToEntity(request.user, request.resource);
		return new request.nestedApi.database.module(entityData);
	}

	private async alter(request: AlterNestedResourceRequest, entity: any) {
		const entityRepalce = await request.nestedApi.mapping.alterToEntity(request.user, request.resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(request.operation == AlterOperation.Update && !value))
				entity[key] = value;
		});
	}
}
