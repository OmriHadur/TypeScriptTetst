import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import sendToMediator from "../../../controllers/sendToMediator";
import { AlterOperation, ExpressRequest } from "../../../types/apiRelated";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import GetNestedResourcesRequest from "../../../messeges/api/nested/getNestedResourcesRequest";

export default class AddApiRoutesCrudHandler
	implements IRequestHandler<AddApiRoutesReqeust, Unit>
{
	messegeType = AddApiRoutesReqeust.name;

	async handle(request: AddApiRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = request.router;
		const api = request.api;
		const parentRoute = "/" + api.name + "/:parentId/";

		for (let nestedApi of api.nested) {
			const route = parentRoute + nestedApi.name;

			router.get(route,
				sendToMediator(mediator, (req: ExpressRequest) =>
					new GetNestedResourcesRequest(api, nestedApi, req.params.parentId)));

			router.post(route,
				sendToMediator(mediator, (req: ExpressRequest) =>
					new AlterNestedResourceRequest(api, nestedApi, req.params.parentId, AlterOperation.Create, req.body)));

			router.put(route,
				sendToMediator(mediator, (req: ExpressRequest) =>
					new AlterNestedResourceRequest(api, nestedApi, req.params.parentId, AlterOperation.ReplaceOrCreate, req.body)));

			router.put(route + "/:nestedId",
				sendToMediator(mediator, (req: ExpressRequest) =>
					new AlterNestedResourceRequest(api, nestedApi, req.params.parentId, AlterOperation.Replace, req.body, req.params.nestedId)));

			router.patch(route + "/:nestedId",
				sendToMediator(mediator, (req: ExpressRequest) =>
					new AlterNestedResourceRequest(api, nestedApi, req.params.parentId, AlterOperation.Update, req.body, req.params.nestedId)));
		}
	}
}
