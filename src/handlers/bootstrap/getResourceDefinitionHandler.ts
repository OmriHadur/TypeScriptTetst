import mongoose from 'mongoose';

import ResourceDefinition from "../../data/modules/resourceDefinition";
import Dictionary from '../../general/dictionary';
import Result from "../../mediator/Data/result";
import ISyncRequestHandler from '../../mediator/interfaces/syncRequestHandler';
import GetResourceDefinitionRequest from "../../messeges/bootstrap/getResourceDefinitionRequest";

const Scheme = mongoose.Schema;

export default class GetResourceDefinitionHandler
    implements ISyncRequestHandler<GetResourceDefinitionRequest, ResourceDefinition>
{
    messegeType = GetResourceDefinitionRequest.name;

    handle(request: GetResourceDefinitionRequest, result: Result<ResourceDefinition>): void {
        const name = request.name;
        const resourceDefinition = new ResourceDefinition(name);
        this.addResourceProperties(request, resourceDefinition);
        resourceDefinition.database = request.schemes[request.name];
        result.value = resourceDefinition;
    }

    private addResourceProperties(request: GetResourceDefinitionRequest, resourceDefinition: ResourceDefinition) {
        this.addProperties(request.resourceConfig.create?.input, resourceDefinition.properties.create);
        this.addProperties(request.resourceConfig.create?.input, resourceDefinition.properties.unique);
        this.addProperties(request.resourceConfig.create?.entity, resourceDefinition.properties.unique, (v: any) => v.isUniqe);
        this.addProperties(request.resourceConfig.alter?.entity, resourceDefinition.properties.unique, (v: any) => v.isUniqe);
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


}