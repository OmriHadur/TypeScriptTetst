import ApiDefinition from "../../data/apiDefinition";
import Dictionary from "../../general/dictionary";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

import mongoose, { Types } from 'mongoose';
import Result from "../../mediator/Data/result";
import GetApiDefinitionReqeust from "../../messeges/bootstrap/getApiDefinitionReqeust";
const Scheme = mongoose.Schema;

export default class GetApiDefinitionHandler
    implements IRequestHandler<GetApiDefinitionReqeust, ApiDefinition>
{
    messegeType = GetApiDefinitionReqeust.name;

    async handle(request: GetApiDefinitionReqeust, result: Result<ApiDefinition>): Promise<any> {
        const apiDefinition = { ...request.apiJsonDefinition, route: request.route };
        const entity: Dictionary<string> = apiDefinition.types.entity!;
        Object.entries(entity).forEach(([key, value]) => {
            if (request.dataSchemes[value])
                entity[key] = request.dataSchemes[value];
        });
        apiDefinition.module = this.entityToModule(apiDefinition.route, entity);
        result.value = apiDefinition;
    }

    private entityToModule(route: string, entityDefinition: any) {
        const scheme = new Scheme(entityDefinition);
        return mongoose.model(route, scheme);
    }
}