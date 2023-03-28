import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";

export default class AlterNestedResourcesHandler implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async handle(request: AlterNestedResourceRequest, result: Result<any>): Promise<void> {
		let entity = request.entity;
		await this.alter(request, entity);
		await request.parentEntity.save();
		const parentEntity = await request.parentApi.mapping.entityToResource(request.apiContex, request.parentEntity);
		result.value = parentEntity;
	}

	private async alter(request: AlterNestedResourceRequest, entity: any) {
		const entityRepalce = await request.nestedApi.mapping.alterToEntity(request.apiContex, request.resource);
		Object.entries(entityRepalce).forEach(([key, value]) => {
			if (!(request.isOnlyUpdate && !value))
				entity[key] = value;
		});
	}
}
