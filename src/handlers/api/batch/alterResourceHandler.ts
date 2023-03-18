import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourcesRequest from "../../../messeges/api/batch/alterResourcesRequest";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterResourcesHandler implements IRequestHandler<AlterResourcesRequest, any> {
	messegeType = AlterResourcesRequest.name;

	async handle(request: AlterResourcesRequest, result: Result<any>): Promise<void> {
		let entities = request.entities;

		if (this.isShouldCreate(request))
			await this.create(request, entities);
		await this.alter(request, entities);

		if (request.resourcesId)
			entities = await request.api.module.updateMany({ _id: { $in: request.resourcesId } }, entities);
		else
			entities = await request.api.module.create(entities);
		result.value = await request.api.mapEntitiesToResources(entities);
	}

	private isShouldCreate(request: AlterResourcesRequest) {
		return request.operation == AlterOperation.Create || (request.operation == AlterOperation.ReplaceOrCreate && request.entities.length > 0);
	}

	private async create(request: AlterResourcesRequest, entities: any[]) {
		for (let resource of request.resources) {
			const entityData = await request.api.mapCreateToEntity(resource);
			const entity = new request.api.module(entityData);
			entities.push(entity);
		}
	}

	private async alter(request: AlterResourcesRequest, entities: any[]) {
		for (let i = 0; i < entities.length; i++) {
			const entityRepalce = await request.api.mapAlterToEntity(request.resources[i]);
			Object.entries(entityRepalce).forEach(([key, value]) => {
				if (!(request.operation == AlterOperation.Update && !value))
					entities[i][key] = value;
			});
		}
	}
}
