import express from 'express';
import ApiDefinition from '../data/apiDefinition';
import IMediator from '../mediator/interfaces/mediator';
import crudRoutes from "../routes/crud";

export default function (apiDefinitions: ApiDefinition[], mediator: IMediator) {
    const router = express.Router();
    apiDefinitions.forEach((apiDefinition: ApiDefinition) => {
        crudRoutes(router, apiDefinition, mediator);
    });
    return router;
};