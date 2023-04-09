import ApiContex from "../../../data/apiContex";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";


export default class AlterResourceHandler implements IRequestHandler<AlterResourceRequest, any> {
	messegeType = AlterResourceRequest.name;

	async handle(request: AlterResourceRequest, result: Result<any>): Promise<void> {
		if (!request.entity) {
			let entityData = await request.api.mapping.createToEntity(request.apiContex, request.resource);
			request.apiContex.entity = new request.api.database.module(entityData);
			request.created = true;
		}

		await this.alter(request.api, request.apiContex, request.resource, request.operation, request.apiContex.entity);
		
		request.apiContex.entity = await request.apiContex.entity.save();

		if (request.created && request.api.postCreate)
			await request.api.postCreate(request.apiContex);
		if (request.api.postAlter)
			await request.api.postAlter(request.apiContex);

		result.value = await request.api.mapping.entityToResource(request.apiContex, request.apiContex.entity);
	}

	private async alter(api: ResourceDefinition, contex: ApiContex, resource: any, operation: AlterOperation, entity: any) {
		const entityRepalce = await api.mapping.alterToEntity(contex, resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(operation == AlterOperation.Update && !value))
				entity[key] = value;
		});
	}
}
