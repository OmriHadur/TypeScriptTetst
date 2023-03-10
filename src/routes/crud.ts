
import ApiDefinition from "../data/apiDefinition";
import { Router } from "express";
import IMediator from "../mediator/interfaces/mediator";
import sendToMediator from "../controllers/sendToMediator";
import CreateResourceRequest from "../messeges/createResourceRequest";
import { ExpressRequest } from "../types/apiRelated";
import GetAllResourcesRequest from "../messeges/getAllResourcesRequest";
import GetResourceByIdRequest from "../messeges/getResourceByIdRequest";
import DeleteAllResourcesRequest from "../messeges/deleteAllResourcesRequest";
import AlterResourceRequest from "../messeges/alterResourceRequest";
import DeleteResourceByIdRequest from "../messeges/deleteResourceByIdRequest";

export default function (router: Router, api: ApiDefinition, mediator: IMediator) {
	const route = api.route;

	router.get('/' + route,
		sendToMediator(mediator, () => new GetAllResourcesRequest(api)));

	router.get('/' + route + '/:id',
		sendToMediator(mediator, (req: ExpressRequest) => new GetResourceByIdRequest(api, req.params.id)));

	router.put('/' + route + '/:id',
		sendToMediator(mediator, (req: ExpressRequest) => new AlterResourceRequest(api, true, req.params.id, req.body)));

	router.patch('/' + route + '/:id',
		sendToMediator(mediator, (req: ExpressRequest) => new AlterResourceRequest(api, false, req.params.id, req.body)));

	router.post('/' + route,
		sendToMediator(mediator, (req: ExpressRequest) => new CreateResourceRequest(api, req.body), 201));

	router.delete('/' + route,
		sendToMediator(mediator, () => new DeleteAllResourcesRequest(api)));

	router.delete('/' + route + '/:id',
		sendToMediator(mediator, (req: ExpressRequest) => new DeleteResourceByIdRequest(api, req.params.id)));
}