import IRequestHandler from "../mediator/interfaces/requestHandler";
import DeleteAllResourcesRequest from "../messeges/deleteAllResourcesRequest";

export default class CreateResourceHandler
	implements IRequestHandler<DeleteAllResourcesRequest, any>
{
	messegeType = DeleteAllResourcesRequest.name;

	async handle(request: DeleteAllResourcesRequest): Promise<any | Error> {
		await request.api.module.deleteMany();
	}
}
