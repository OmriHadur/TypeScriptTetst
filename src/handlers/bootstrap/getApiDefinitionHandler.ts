import ApiDefinition from "../../data/apiDefinition";
import Dictionary from "../../general/dictionary";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

import mongoose from 'mongoose';
import Result from "../../mediator/Data/result";
import GetApiDefinitionReqeust from "../../messeges/bootstrap/getApiDefinitionReqeust";
const Scheme = mongoose.Schema;

export default class GetApiDefinitionHandler
    implements IRequestHandler<GetApiDefinitionReqeust, ApiDefinition>
{
    messegeType = GetApiDefinitionReqeust.name;
    nested: any = {};

    async handle(request: GetApiDefinitionReqeust, result: Result<ApiDefinition>): Promise<any> {
        const apiDefinition = { ...request.apiJsonDefinition, route: request.route };
        const entity: Dictionary<string> = apiDefinition.types.entity!;
        Object.entries(entity).forEach(([key, value]) => {
            if (request.dataSchemes[value])
                entity[key] = request.dataSchemes[value];
        });
        apiDefinition.module = this.entityToModule(apiDefinition.route, entity);
        this.addCreateUnionAlter(apiDefinition);
        result.value = apiDefinition;
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