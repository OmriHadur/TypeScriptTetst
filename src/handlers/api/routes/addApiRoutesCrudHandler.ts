import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import { AlterOperation, ExpressRequest } from "../../../types/apiRelated";
import GetAllResourcesRequest from "../../../messeges/api/crud/getAllResourcesRequest";
import GetResourceByIdRequest from "../../../messeges/api/crud/getResourceByIdRequest";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import DeleteAllResourcesRequest from "../../../messeges/api/crud/deleteAllResourcesRequest";
import DeleteResourceByIdRequest from "../../../messeges/api/crud/deleteResourceByIdRequest";
import sendToMediator from "../../../controllers/sendToMediator";
import GetAllOwnedResourcesRequest from "../../../messeges/api/owned/getAllOwnedResourcesRequest";

export default class AddApiRoutesCrudHandler
	implements IRequestHandler<AddApiRoutesReqeust, Unit>
{
	messegeType = AddApiRoutesReqeust.name;

	async handle(request: AddApiRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = request.router;
		const api = request.api;
		const route = '/' + api.name;

		router.get(route, sendToMediator(mediator, () =>
			new GetAllResourcesRequest(api)));

		router.get(route + "/owned", sendToMediator(mediator, () => new GetAllOwnedResourcesRequest(api)));

		router.get(route + '/:id', sendToMediator(mediator, (req: ExpressRequest) =>
			new GetResourceByIdRequest(api, req.params.id)));

		router.post(route, sendToMediator(mediator, (req: ExpressRequest) =>
			new AlterResourceRequest(api, AlterOperation.Create, req.body), () => 201));

		router.put(route + '/:id', sendToMediator(mediator, (req: ExpressRequest) =>
			new AlterResourceRequest(api, AlterOperation.Replace, req.body, req.params.id)));

		router.put(route, sendToMediator(mediator,
			(req: ExpressRequest) =>
				new AlterResourceRequest(api, AlterOperation.ReplaceOrCreate, req.body),
			(req) => req.created ? 201 : 200));

		router.patch(route + '/:id', sendToMediator(mediator, (req: ExpressRequest) =>
			new AlterResourceRequest(api, AlterOperation.Update, { ...req.body, ...req.query }, req.params.id)));

		router.delete(route, sendToMediator(mediator, () =>
			new DeleteAllResourcesRequest(api)));

		router.delete(route + '/:id', sendToMediator(mediator, (req: ExpressRequest) =>
			new DeleteResourceByIdRequest(api, req.params.id)));
	}
}
