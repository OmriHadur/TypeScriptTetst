import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetAllResourcesRequest from "../../../messeges/api/crud/getAllResourcesRequest";

export default class CreateResourceHandler
	implements IRequestHandler<GetAllResourcesRequest, any[]>
{
	messegeType = GetAllResourcesRequest.name;

	async handle(request: GetAllResourcesRequest, result: Result<any[]>): Promise<void> {
		const entities = await request.api.database.module.find();
		result.value = await request.api.mapping.entitiesToResources(request.user, entities);
	}
}
