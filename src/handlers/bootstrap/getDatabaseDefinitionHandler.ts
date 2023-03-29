import mongoose from 'mongoose';

import InputConfig from '../../data/input/inputConfig';
import ResourceConfig from '../../data/input/resourceConfig';
import DatabaseDefinition from '../../data/modules/databaseDefinition';
import Dictionary from '../../general/dictionary';
import Result from "../../mediator/Data/result";
import ISyncRequestHandler from '../../mediator/interfaces/syncRequestHandler';
import GetDatabaseDefinitionRequest from '../../messeges/bootstrap/getDatabaseDefinitionRequest';

const Scheme = mongoose.Schema;

export default class GetDatabaseDefinitionHandler
    implements ISyncRequestHandler<GetDatabaseDefinitionRequest, DatabaseDefinition>
{
    messegeType = GetDatabaseDefinitionRequest.name;

    async handle(request: GetDatabaseDefinitionRequest, result: Result<DatabaseDefinition>) {
        const scheme = this.map(request.resourceConfig, request.schemesGetter);
        const module = this.getModule(request.name, scheme);
        result.value = new DatabaseDefinition(scheme, module);
    }

    private map(resourceConfig: ResourceConfig, schemesGetters: Dictionary<any>) {
        const scheme: any = {};
        this.addTypes(resourceConfig.create, scheme, schemesGetters);
        this.addTypes(resourceConfig.alter, scheme, schemesGetters);
        return scheme;
    }

    private addTypes(inputConfig: InputConfig, scheme: any, schemesGetters: Dictionary<any>) {
        if (inputConfig) {
            for (let [key, value] of Object.entries(inputConfig.entity)) {
                let dataType = value.type ?? value;
                if (schemesGetters[dataType])
                    dataType = schemesGetters[dataType]().scheme;
                scheme[key] = dataType;
            }
        }
    }

    private getModule(route: string, scheme: any) {
        return mongoose.model(route, new Scheme(scheme));
    }
}