import ApiDefinition from "../../data/apiDefinition";
import Dictionary from "../../general/dictionary";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetResourceByIdRequest from "../../messeges/bootstrap/getApiDefinisitionsReqeust";
import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

export default class DeleteResourceByIdHandler
    implements IRequestHandler<GetResourceByIdRequest, ApiDefinition[]>
{
    messegeType = GetResourceByIdRequest.name;

    async handle(request: GetResourceByIdRequest): Promise<any | Error> {
        const apiFolder = request.apiFolder;
        const apiJDefinitions: ApiDefinition[] = [];
        Object.entries(apiFolder).forEach(([apiRoute, apiDefinition]) => {
            apiDefinition.route = apiRoute;
            const entity: Dictionary<string> = apiDefinition.types.entity;
            Object.entries(entity).forEach(([key, value]) => {
                if (request.schemes[value])
                    entity[key] = request.schemes[value];
            });
            apiDefinition.module = DeleteResourceByIdHandler.entityToModule(apiRoute, entity);
            DeleteResourceByIdHandler.addCreateUnionAlter(apiDefinition);
            apiJDefinitions.push(apiDefinition);
        });
        return apiJDefinitions;
    }

    static entityToModule(route: string, entityDefinition: any) {
        const scheme = new Scheme(entityDefinition);
        return mongoose.model(route, scheme);
    }

    static addCreateUnionAlter(apiDefinition: ApiDefinition) {
        apiDefinition.types.createAndAlter = { ...apiDefinition.types.create, ...apiDefinition.types.alter };
        apiDefinition.validations.createAndAlter = { ...apiDefinition.validations.create, ...apiDefinition.validations.alter };
        apiDefinition.mapping.createAndAlterToEntity = { ...apiDefinition.mapping.createToEntity, ...apiDefinition.mapping.alterToEntity };
    }
}