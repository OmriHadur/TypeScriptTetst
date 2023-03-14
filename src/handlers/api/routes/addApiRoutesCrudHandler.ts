import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import { ExpressRequest } from "../../../types/apiRelated";
import GetAllResourcesRequest from "../../../messeges/api/crud/getAllResourcesRequest";
import GetResourceByIdRequest from "../../../messeges/api/crud/getResourceByIdRequest";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import CreateResourceRequest from "../../../messeges/api/crud/createResourceRequest";
import CreateOrAlterResourceRequest from "../../../messeges/api/crud/createOrAlterResourceRequest";
import DeleteAllResourcesRequest from "../../../messeges/api/crud/deleteAllResourcesRequest";
import DeleteResourceByIdRequest from "../../../messeges/api/crud/deleteResourceByIdRequest";
import sendToMediator from "../../../helpers/sendApiReqeustToMediator";

export default class AddApiRoutesCrudHandler
	implements IRequestHandler<AddApiRoutesReqeust, Unit>
{
	messegeType = AddApiRoutesReqeust.name;

	async handle(request: AddApiRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = request.router;
		const api = request.api;
		const route = '/' + api.route;

		router.get(route,
			sendToMediator(mediator, () => new GetAllResourcesRequest(api)));

		router.get(route + '/:id',
			sendToMediator(mediator, (req: ExpressRequest) => new GetResourceByIdRequest(api, req.params.id)));

		router.put(route + '/:id',
			sendToMediator(mediator, (req: ExpressRequest) => new AlterResourceRequest(api, true, req.params.id, req.body)));

		router.patch(route + '/:id',
			sendToMediator(mediator, (req: ExpressRequest) => new AlterResourceRequest(api, false, req.params.id, req.body)));

		router.post(route,
			sendToMediator(mediator, (req: ExpressRequest) => new CreateResourceRequest(api, req.body), () => 201));

		router.put(route,
			sendToMediator(mediator,
				(req: ExpressRequest) => new CreateOrAlterResourceRequest(api, true, req.body),
				(req) => req.entity ? 200 : 201));

		router.patch(route,
			sendToMediator(mediator,
				(req: ExpressRequest) => new CreateOrAlterResourceRequest(api, false, req.body),
				(req) => req.entity ? 200 : 201));

		router.delete(route,
			sendToMediator(mediator, () => new DeleteAllResourcesRequest(api)));

		router.delete(route + '/:id',
			sendToMediator(mediator, (req: ExpressRequest) => new DeleteResourceByIdRequest(api, req.params.id)));
	}
}
