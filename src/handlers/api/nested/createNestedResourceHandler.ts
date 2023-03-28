import Result from "../../../mediator/Data/result";
import IMediator from "../../../mediator/interfaces/mediator";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";

export default class CreateNestedResourceHandler implements IRequestHandler<CreateNestedResourceRequest, any> {
	messegeType = CreateNestedResourceRequest.name;

	async handle(request: CreateNestedResourceRequest, result: Result<any>, mediator: IMediator): Promise<void> {
		if (!request.entity) {
			const entity = await new request.nestedApi.database.module(request.entityData);
			request.nestedEntities!.push(entity);
		}
		const alterRequest = new AlterNestedResourceRequest(request.parentApi, request.nestedApi, request.parentId, request.resource);
		alterRequest.apiContex = request.apiContex;
		alterRequest.parentEntity= request.parentEntity;
		alterRequest.nestedEntities= request.nestedEntities;
		alterRequest.entity = request.entity;
		result = await mediator.send(alterRequest);
	}
}