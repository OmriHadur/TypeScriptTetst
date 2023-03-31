import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import { AlterOperation, ExpressRequest } from "../../../types/apiRelated";
import AlterResourcesRequest from "../../../messeges/api/batch/alterResourcesRequest";
import { send } from "../../../controllers/sendToMediator";

export default class AddApiRoutesBatchHandler
	implements IRequestHandler<AddApiRoutesReqeust, Unit>
{
	messegeType = AddApiRoutesReqeust.name;

	async handle(request: AddApiRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = request.router;
		const api = request.api;
		const route = '/' + api.name + "/batch";

		router.post(route, send(mediator, (req: ExpressRequest) =>
			new AlterResourcesRequest(api, AlterOperation.Create, req.body), () => 201));

		router.put(route, send(mediator, (req: ExpressRequest) =>
			new AlterResourcesRequest(api, AlterOperation.ReplaceOrCreate, req.body), () => 201));

		router.patch(route, send(mediator, (req: ExpressRequest) =>
			new AlterResourcesRequest(api, AlterOperation.Update, req.body), () => 201));
	}
}
