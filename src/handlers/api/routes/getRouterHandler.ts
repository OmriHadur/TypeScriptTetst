import express from 'express';
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import IMediator from "../../../mediator/interfaces/mediator";
import AddApiRoutesReqeust from "../../../messeges/api/routes/addApiRoutesReqeust";
import AddRoutesReqeust from "../../../messeges/api/routes/addRoutesReqeust";
import Unit from "../../../mediator/Data/unit";

export default class GetRouterHandler
	implements IRequestHandler<AddRoutesReqeust, Unit>
{
	messegeType = AddRoutesReqeust.name;

	async handle(request: AddRoutesReqeust, result: Result<Unit>, mediator: IMediator): Promise<void> {
		const router = express.Router();
		for (let apiDefinition of request.apiDefinitions)
			await mediator.send(new AddApiRoutesReqeust(router, apiDefinition));
		request.expressApp.use(router);
	}
}
