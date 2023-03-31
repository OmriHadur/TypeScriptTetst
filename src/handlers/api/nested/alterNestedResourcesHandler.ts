import ApiContex from "../../../data/apiContex";
import ApiDefinition from "../../../data/modules/apiDefinition";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterNestedResourcesHandler implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async handle(request: AlterNestedResourceRequest, result: Result<any>): Promise<void> {
		if (!request.entity) {
			request.entity = await new request.nestedApi.database.module(request.entityData);
			request.nestedEntities!.push(request.entity);
		}
		await this.alter(request.nestedApi, request.apiContex, request.resource, request.operation, request.entity);
		await this.alter(request.parentApi, request.apiContex, request.parentEntity, request.operation, request.parentEntity);
		await request.parentEntity.save();
		const parentEntity = await request.parentApi.mapping.entityToResource(request.apiContex, request.parentEntity);
		result.value = parentEntity;
	}

	private async alter(api: ResourceDefinition, contex: ApiContex, resource: any, operation: AlterOperation, entity: any) {
		const entityRepalce = await api.mapping.alterToEntity(contex, resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(operation == AlterOperation.Update && !value))
				entity[key] = value;
		});
	}
}
