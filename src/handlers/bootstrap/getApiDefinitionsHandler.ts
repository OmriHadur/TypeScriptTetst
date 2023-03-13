import ApiDefinition from "../../data/apiDefinition";
import Dictionary from "../../general/dictionary";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

import mongoose from 'mongoose';
import GetApiDefinitionsReqeust from "../../messeges/bootstrap/getApiDefinitionsReqeust";
const Scheme = mongoose.Schema;

export default class GetApiDefinitionsHandler
    implements IRequestHandler<GetApiDefinitionsReqeust, ApiDefinition[]>
{
    messegeType = GetApiDefinitionsReqeust.name;

    async handle(request: GetApiDefinitionsReqeust): Promise<any | Error> {
        const apiJDefinitions: ApiDefinition[] = [];
        Object.entries(request.apiFolder).forEach(([apiRoute, apiDefinition]) =>
            this.addApiDefinition(apiDefinition, apiRoute, request.schemes, apiJDefinitions)
        );
        return apiJDefinitions;
    }

    private addApiDefinition(apiDefinition: any, apiRoute: string, schemes: Dictionary<any>, apiJDefinitions: ApiDefinition[]) {
        apiDefinition.route = apiRoute;
        const entity: Dictionary<string> = apiDefinition.types.entity;
        Object.entries(entity).forEach(([key, value]) => {
            if (schemes[value])
                entity[key] = schemes[value];
        });
        apiDefinition.module = this.entityToModule(apiRoute, entity);
        this.addCreateUnionAlter(apiDefinition);
        apiJDefinitions.push(apiDefinition);
    }

    private entityToModule(route: string, entityDefinition: any) {
        const scheme = new Scheme(entityDefinition);
        return mongoose.model(route, scheme);
    }

    private addCreateUnionAlter(apiDefinition: ApiDefinition) {
        apiDefinition.types.createAndAlter = { ...apiDefinition.types.create, ...apiDefinition.types.alter };
        apiDefinition.validations.createAndAlter = { ...apiDefinition.validations.create, ...apiDefinition.validations.alter };
        apiDefinition.mapping.createAndAlterToEntity = { ...apiDefinition.mapping.createToEntity, ...apiDefinition.mapping.alterToEntity };
    }
}