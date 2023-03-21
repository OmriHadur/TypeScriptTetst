import mongoose from 'mongoose';

import InputConfig from '../../../data/input/inputConfig';
import ResourceConfig from '../../../data/input/resourceConfig';
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import Dictionary from '../../../general/dictionary';
import Result from "../../../mediator/Data/result";
import IMediator from '../../../mediator/interfaces/mediator';
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetResourceDefinitionRequest from "../../../messeges/bootstrap/getResourceDefinitionRequest";

const Scheme = mongoose.Schema;

export default class GetResourceDefinitionHandler
    implements IRequestHandler<GetResourceDefinitionRequest, ResourceDefinition>
{
    messegeType = GetResourceDefinitionRequest.name;

    async handle(request: GetResourceDefinitionRequest, result: Result<ResourceDefinition>, mediator: IMediator): Promise<void> {
        const name = request.name;
        const resourceDefinition = new ResourceDefinition(name);
        resourceDefinition.types.unique = this.getUnique(request.resourceConfig.create);
        const scheme = this.map(request.resourceConfig, request.schemes);
        request.schemes[request.name] = scheme;
        resourceDefinition.database.scheme = scheme;
        resourceDefinition.database.module = this.getModule(request.name, scheme);
        result.value = resourceDefinition;
    }

    private getUnique(inputConfig: InputConfig): string[] {
        const unique = [];
        if (inputConfig)
            for (let [key, value] of Object.entries(inputConfig.entity))
                if (value.isUniqe)
                    unique.push(key);
        return unique;
    }


    private map(resourceConfig: ResourceConfig, schemes: Dictionary<any>) {
        const scheme: any = {};
        this.addTypes(resourceConfig.create, scheme, schemes);
        this.addTypes(resourceConfig.alter, scheme, schemes);
        return scheme;
    }

    private addTypes(inputConfig: InputConfig, scheme: any, schemes: Dictionary<any>) {
        if (inputConfig) {
            for (let [key, value] of Object.entries(inputConfig.entity)) {
                let dataType = value.type ?? value;
                if (schemes[dataType])
                    dataType = schemes[dataType];
                scheme[key] = dataType;
            }
        }
    }

    private getModule(route: string, scheme: any) {
        return mongoose.model(route, new Scheme(scheme));
    }
}