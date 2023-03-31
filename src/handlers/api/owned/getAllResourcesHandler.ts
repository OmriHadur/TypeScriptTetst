import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetAllOwnedResourcesRequest from "../../../messeges/api/owned/getAllOwnedResourcesRequest";

export default class GetAllResourcesHandler
	implements IRequestHandler<GetAllOwnedResourcesRequest, any[]>
{
	messegeType = GetAllOwnedResourcesRequest.name;

	async handle(request: GetAllOwnedResourcesRequest, result: Result<any[]>): Promise<void> {
		const entities = await request.api.database.module.find({ userId: request.apiContex.user.id });
		result.value = await request.api.mapping.entitiesToResources(request.apiContex, entities);
	}
}
