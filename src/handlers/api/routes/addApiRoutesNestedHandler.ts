import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import Unit from "../../../mediator/Data/unit";
import sendToMediator from "../../../controllers/sendToMediator";
import { ExpressRequest } from "../../../types/apiRelated";
import GetNestedResourcesRequest from "../../../messeges/api/nested/getNestedResourcesRequest";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";

export default class AddApiRoutesCrudHandler
	implements IRequestHandler<AddApiRoutesReqeust, Unit>
{
	messegeType = AddApiRoutesReqeust.name;

	async handle(request: AddApiRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = request.router;
		const api = request.api;
		const parentRoute = "/" + api.route + "/:parentId/";

		for (let nestedApi of api.nestedApis) {
			const route = parentRoute + nestedApi.route;

			router.get(route,
				sendToMediator(mediator, (req: ExpressRequest) => new GetNestedResourcesRequest(api, nestedApi, req.params.parentId)));

			router.post(route,
				sendToMediator(mediator, (req: ExpressRequest) => new CreateNestedResourceRequest(api, nestedApi, req.params.parentId, req.body)));
		}
	}
}
