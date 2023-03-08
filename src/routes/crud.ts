
import getbyIdController from "../controllers/getbyId";
import getAllController from "../controllers/getAll";
import alterByIdontroller from "../controllers/alterById";
import createController from "../controllers/create";
import deleteAllController from "../controllers/deleteAll";

export default function (router: any, apiDefinition: any) {
    const route = apiDefinition.route;
    router.get('/' + route, getAllController(apiDefinition));
    router.get('/' + route + '/:id', getbyIdController(apiDefinition));
    router.put('/' + route + '/:id', alterByIdontroller(apiDefinition, true));
    router.patch('/' + route + '/:id', alterByIdontroller(apiDefinition, false));
    router.post('/' + route, createController(apiDefinition));
    router.delete('/' + route, deleteAllController(apiDefinition));
}


