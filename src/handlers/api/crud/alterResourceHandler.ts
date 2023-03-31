import ApiContex from "../../../data/apiContex";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterResourceHandler implements IRequestHandler<AlterResourceRequest, any> {
	messegeType = AlterResourceRequest.name;

	async handle(request: AlterResourceRequest, result: Result<any>): Promise<void> {
		let entity = request.apiContex.entity;

		if (!request.entity) {
			let entityData = await request.api.mapping.createToEntity(request.apiContex, request.resource);
			entity = new request.api.database.module(entityData);
			request.created = true;
		}

		await this.alter(request.api, request.apiContex, request.resource, request.operation, entity);
		entity = await entity.save();
		result.value = await request.api.mapping.entityToResource(request.apiContex, entity);
	}

	private async alter(api: ResourceDefinition, contex: ApiContex, resource: any, operation: AlterOperation, entity: any) {
		const entityRepalce = await api.mapping.alterToEntity(contex, resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(operation == AlterOperation.Update && !value))
				entity[key] = value;
		});
	}
}
