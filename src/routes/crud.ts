
import getbyIdController from "../controllers/getbyId";
import getAllController from "../controllers/getAll";
import alterByIdontroller from "../controllers/alterById";
import createController from "../controllers/create";
import deleteAllController from "../controllers/deleteAll";
import ApiDefinition from "../data/apiDefinition";
import { Router } from "express";
import deleteByIdController from "../controllers/deleteById";
import IMediator from "../mediator/interfaces/mediator";

export default function (router: Router, apiDefinition: ApiDefinition, mediator: IMediator) {
    const route = apiDefinition.route;
    router.get('/' + route, getAllController(apiDefinition, mediator));
    router.get('/' + route + '/:id', getbyIdController(apiDefinition));
    router.put('/' + route + '/:id', alterByIdontroller(apiDefinition, true));
    router.patch('/' + route + '/:id', alterByIdontroller(apiDefinition, false));
    router.post('/' + route, createController(apiDefinition, mediator));
    router.delete('/' + route, deleteAllController(apiDefinition));
    router.delete('/' + route + '/:id', deleteByIdController(apiDefinition));
}
