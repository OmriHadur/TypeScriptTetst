
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetNestedResourcesRequest from "../../../messeges/api/nested/getNestedResourcesRequest";

export default class GetNestedResourcesHandler implements IRequestHandler<GetNestedResourcesRequest, any[]> {
	messegeType = GetNestedResourcesRequest.name;

	async handle(request: GetNestedResourcesRequest, result: Result<any[]>): Promise<void> {
		const parentEntity = await request.parentApi.module.findById(request.parentId);
		result.value = await request.parentApi.mapEntityToResource(parentEntity);
	}
}
