import mongoose from 'mongoose';

import InputConfig from '../../data/input/inputConfig';
import ResourceConfig from '../../data/input/resourceConfig';
import ResourceDefinition from "../../data/modules/resourceDefinition";
import Dictionary from '../../general/dictionary';
import Result from "../../mediator/Data/result";
import IMediator from '../../mediator/interfaces/mediator';
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetResourceDefinitionRequest from "../../messeges/bootstrap/getResourceDefinitionRequest";

const Scheme = mongoose.Schema;

export default class GetResourceDefinitionHandler
    implements IRequestHandler<GetResourceDefinitionRequest, ResourceDefinition>
{
    messegeType = GetResourceDefinitionRequest.name;

    async handle(request: GetResourceDefinitionRequest, result: Result<ResourceDefinition>, mediator: IMediator): Promise<void> {
        const name = request.name;
        const resourceDefinition = new ResourceDefinition(name);
        this.addResourceProperties(request, resourceDefinition);
        const scheme = this.map(request.resourceConfig, request.schemes);
        request.schemes[request.name] = scheme;
        resourceDefinition.database.scheme = scheme;
        resourceDefinition.database.module = this.getModule(request.name, scheme);
        result.value = resourceDefinition;
    }

    private addResourceProperties(request: GetResourceDefinitionRequest, resourceDefinition: ResourceDefinition) {
        this.addProperties(request.resourceConfig.create?.input, resourceDefinition.properties.create);
        this.addProperties(request.resourceConfig.create?.entity, resourceDefinition.properties.unique, (v: any) => v.isUniqe);
        this.addProperties(request.resourceConfig.alter?.input, resourceDefinition.properties.alter);
        this.addProperties(request.resourceConfig.create?.entity, resourceDefinition.properties.entity);
        this.addProperties(request.resourceConfig.alter?.entity, resourceDefinition.properties.entity);
        this.addProperties(request.resourceConfig.resource, resourceDefinition.properties.resource);
    }

    private addProperties(input: Dictionary<any>, properties: string[], predicate?: any) {
        if (input)
            for (let [key, value] of Object.entries(input))
                if (!predicate || predicate(value))
                    properties.push(key);
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