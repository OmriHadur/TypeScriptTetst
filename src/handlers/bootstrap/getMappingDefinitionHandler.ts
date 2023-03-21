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
            (apiContex: ApiContex, createResource: any) => this.map(apiContex, createResource, request.resourceDefinition.properties.entity, createScripts);

        const alterScripts = scriptsBuilder.definitionToScript(request.resourceConfig.alter.entity, true);
        mappingDefinition.alterToEntity =
            (apiContex: ApiContex, alterResource: any) => this.map(apiContex, alterResource, request.resourceDefinition.properties.entity, alterScripts);

        const resourceScripts = scriptsBuilder.definitionToScript(request.resourceConfig.resource, false);
        mappingDefinition.entityToResource =
            async (apiContex: ApiContex, entity: any) => {
                const resource = await this.map(apiContex, entity, request.resourceDefinition.properties.resource, resourceScripts);
                const nested = (request.resourceDefinition as ApiDefinition).nested;
                await this.mapNested(apiContex, nested, resource, entity);
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

    async map(apiContex: ApiContex, input: any, properties: any, scripts: any) {
        const output: any = {};
        apiContex.input = input;
        for (let [name, script] of Object.entries(scripts))
            output[name] = await scriptsBuilder.runScript(script, apiContex)
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
