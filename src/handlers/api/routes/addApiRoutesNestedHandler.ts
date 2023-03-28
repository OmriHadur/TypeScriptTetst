import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import { send } from "../../../controllers/sendToMediator";
import { ExpressRequest } from "../../../types/apiRelated";
import GetNestedResourcesRequest from "../../../messeges/api/nested/getNestedResourcesRequest";
import CreateOrReplaceNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";
import ReplaceOrUpdateNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";

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
				send(mediator, (req: ExpressRequest) =>
					new GetNestedResourcesRequest(api, nestedApi, req.params.parentId)));

			router.post(route,
				send(mediator, (req: ExpressRequest) =>
					new CreateOrReplaceNestedResourceRequest(api, nestedApi, req.params.parentId, req.body, true)));

			router.put(route,
				send(mediator, (req: ExpressRequest) =>
					new CreateOrReplaceNestedResourceRequest(api, nestedApi, req.params.parentId, req.body, false)));

			router.put(route + "/:nestedId",
				send(mediator, (req: ExpressRequest) =>
					new ReplaceOrUpdateNestedResourceRequest(api, nestedApi, req.params.parentId, req.body, req.params.nestedId, true)));

			router.patch(route + "/:nestedId",
				send(mediator, (req: ExpressRequest) =>
					new ReplaceOrUpdateNestedResourceRequest(api, nestedApi, req.params.parentId, req.body, req.params.nestedId, false)));
		}
	}
}
