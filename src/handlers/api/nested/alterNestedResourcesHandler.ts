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
		await this.alter(request);
		await request.parentEntity.save();
		const parentEntity = await request.parentApi.mapping.entityToResource(request.apiContex, request.parentEntity);
		result.value = parentEntity;
	}

	private async alter(request: AlterNestedResourceRequest) {
		const entityRepalce = await request.nestedApi.mapping.alterToEntity(request.apiContex, request.resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(request.operation == AlterOperation.Update && !value))
				request.entity[key] = value;
		});
	}
}
