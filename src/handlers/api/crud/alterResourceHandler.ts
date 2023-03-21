import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterResourceHandler implements IRequestHandler<AlterResourceRequest, any> {
	messegeType = AlterResourceRequest.name;

	async handle(request: AlterResourceRequest, result: Result<any>): Promise<void> {
		let entity = request.entity;

		if (this.isShouldCreate(request))
			entity = await this.create(request);
		await this.alter(request, entity);

		entity = await entity.save();
		result.value = await request.api.mapping.entityToResource(request.apiContex, entity);
	}

	private isShouldCreate(request: AlterResourceRequest) {
		return request.operation == AlterOperation.Create || (request.operation == AlterOperation.ReplaceOrCreate && !request.entity);
	}

	private async create(request: AlterResourceRequest) {
		const entityData = await request.api.mapping.createToEntity(request.apiContex, request.resource);
		return new request.api.database.module(entityData);
	}

	private async alter(request: AlterResourceRequest, entity: any) {
		const entityRepalce = await request.api.mapping.alterToEntity(request.apiContex, request.resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(request.operation == AlterOperation.Update && !value))
				entity[key] = value;
		});
	}
}
