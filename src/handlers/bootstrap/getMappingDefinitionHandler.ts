import ApiDefinition from "../../data/modules/apiDefinition";
import MappingDefinition from "../../data/modules/mappingDefinition";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetMappingDefinitionRequest from "../../messeges/bootstrap/getMappingDefinitionRequest";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import ApiContex from "../../data/apiContex";
import ResourceDefinition from "../../data/modules/resourceDefinition";

export default class GetMappingDefinitionHandler
    implements IRequestHandler<GetMappingDefinitionRequest, MappingDefinition>
{
    messegeType = GetMappingDefinitionRequest.name;

    async handle(request: GetMappingDefinitionRequest, result: Result<MappingDefinition>): Promise<void> {

        const mappingDefinition = new MappingDefinition();
        const createScripts = scriptsBuilder.definitionToScript(request.resourceConfig.create.entity, true);
        mappingDefinition.createToEntity =
            (user: any, createResource: any, variablesValue: any) => this.map(user, createResource, request.resourceDefinition.properties.entity, createScripts, variablesValue, request.apiContex);

        const alterScripts = scriptsBuilder.definitionToScript(request.resourceConfig.alter.entity, true);
        mappingDefinition.alterToEntity =
            (user: any, alterResource: any, variablesValue: any) => this.map(user, alterResource, request.resourceDefinition.properties.entity, alterScripts, variablesValue, request.apiContex);

        const resourceScripts = scriptsBuilder.definitionToScript(request.resourceConfig.resource, false);
        mappingDefinition.entityToResource =
            async (user: any, entity: any, variablesValue: any) => {
                const resource = await this.map(user, entity, request.resourceDefinition.properties.resource, resourceScripts, variablesValue, request.apiContex);
                const nested = (request.resourceDefinition as ApiDefinition).nested;
                await this.mapNested(user, nested, resource, entity);
                return resource;
            };

        mappingDefinition.entitiesToResources = async (user: any, entities: any[], variablesValue: any) => {
            if (!entities)
                return [];
            const resources = [entities.length];
            for (let i = 0; i < entities.length; i++)
                resources[i] = await mappingDefinition.entityToResource(user, entities[i], variablesValue);
            return resources;
        }

        result.value = mappingDefinition;
    }

    async map(user: any, input: any, properties: any, scripts: any, variablesValue: any, apisContext: ApiContex) {
        const output: any = {};
        const context = { ...apisContext, user: user, input: input, variables: variablesValue };
        for (let [name, script] of Object.entries(scripts))
            output[name] = await scriptsBuilder.runScript(script, context)
        for (let property of properties)
            if (!output[property] && input[property])
                output[property] = input[property];
        return output;
    };

    async mapNested(user: any, nested: ResourceDefinition[], resource: any, entity: any) {
        if (nested)
            for (let nestedApi of nested)
                resource[nestedApi.name] = await nestedApi.mapping.entitiesToResources(user, entity[nestedApi.name]);
    }
}
