import ApiDefinition from "../../data/modules/apiDefinition";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

import mongoose from 'mongoose';
import Result from "../../mediator/Data/result";
import GetApiDefinitionReqeust from "../../messeges/oldBootstrap/getApiDefinitionReqeust";
import TypesDefinition from "../../data/modules/typesDefinition";

const Scheme = mongoose.Schema;
/*
export default class GetApiDefinitionHandler
    implements IRequestHandler<GetApiDefinitionReqeust, ApiDefinition>
{
    messegeType = GetApiDefinitionReqeust.name;

    async handle(request: GetApiDefinitionReqeust, result: Result<ApiDefinition>): Promise<any> {
        const apiDefinition = { ...request.apiJsonDefinition, route: request.route } as ApiDefinition;

        const scheme: any = this.map(apiDefinition.types, request.dataSchemes);
        apiDefinition.module = this.entityToModule(apiDefinition.route, scheme);
        result.value = apiDefinition;
    }

    private map(types: TypesDefinition, dataSchemes: any) {
        const scheme: any = {};
        types.unique = Object.keys(types.create);

        Object.entries(types.entity).forEach(([key, value]) => {
            if (key.endsWith('!')) {
                delete types.entity[key];
                key = key.slice(0, -1);
                if (!types.unique?.includes(key))
                    types.unique!.push(key);
            }
            types.entity[key] = value;
            scheme[key] = dataSchemes[value] ? dataSchemes[value] : value;
        });
        return scheme;
    }

    private entityToModule(route: string, entityDefinition: any) {
        const scheme = new Scheme(entityDefinition);
        return mongoose.model(route, scheme);
    }
}

*/