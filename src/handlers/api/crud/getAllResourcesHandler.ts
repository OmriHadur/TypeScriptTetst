import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetAllResourcesRequest from "../../../messeges/getAllResourcesRequest";

export default class CreateResourceHandler
	implements IRequestHandler<GetAllResourcesRequest, any[]>
{
	messegeType = GetAllResourcesRequest.name;

	async handle(request: GetAllResourcesRequest): Promise<any[] | Error> {
		const entities = await request.api.module.find();
		return request.api.mapEntitiesToResources(entities);
	}
}
