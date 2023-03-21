import Unit from "../../../mediator/Data/unit";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import DeleteAllResourcesRequest from "../../../messeges/api/crud/deleteAllResourcesRequest";

export default class CreateResourceHandler
	implements IRequestHandler<DeleteAllResourcesRequest, Unit>
{
	messegeType = DeleteAllResourcesRequest.name;

	async handle(request: DeleteAllResourcesRequest): Promise<void> {
		await request.api.database.module.deleteMany();
	}
}
