import Unit from "../../mediator/Data/unit";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import ApiContex from "../../data/apiContex";
import ApiDefinition from "../../data/apiDefinition";
import AddApiMappingTaskReqeust from "../../messeges/bootstrap/addApiMappingTaskReqeust";

export default class AddApiMappingHandler
    implements IRequestHandler<AddApiMappingTaskReqeust, Unit>
{
    messegeType = AddApiMappingTaskReqeust.name;

    async handle(request: AddApiMappingTaskReqeust): Promise<void> {
        request.apiDefinitions.forEach(api => {
            for (let nestedApi of api.nestedApis)
                this.addApiMapping(nestedApi, request.apiContex);
            this.addApiMapping(api, request.apiContex);
        });
    }

    async addApiMapping(api: ApiDefinition, apiContex: ApiContex) {
        const createScripts = scriptsBuilder.definitionToScript(api.mapping.createAndAlterToEntity);
        api.mapCreateToEntity =
            (createResource: any) => this.map(createResource, api.types.createAndAlter, createScripts, apiContex);

        const alterScripts = scriptsBuilder.definitionToScript(api.mapping.alterToEntity);
        api.mapAlterToEntity =
            (alterResource: any) => this.map(alterResource, api.types.alter, alterScripts, apiContex);

        const resourceScripts = scriptsBuilder.definitionToScript(api.mapping.entityToResource);
        api.mapEntityToResource =
            async (entity: any) => {
                const resource = await this.map(entity, api.types.resource, resourceScripts, apiContex)
                await this.mapNested(api, resource, entity);
                return resource;
            };

        api.mapEntitiesToResources = async (entities: any[]) => {
            const resources = [entities.length];
            for (let i = 0; i < entities.length; i++)
                resources[i] = await api.mapEntityToResource(entities[i]);
            return resources;
        }
    }

    async map(input: any, entityType: any, scripts: any, apisContext: ApiContex) {
        const output: any = {};
        const context = { ...apisContext, input: input };
        for (let propertyScript in scripts)
            output[propertyScript] = await scriptsBuilder.runScript(scripts[propertyScript], context)
        for (let property in entityType)
            if (!output[property])
                output[property] = input[property];
        return output;
    };

    async mapNested(api: ApiDefinition, resource: any, entity: any) {
        if (api.nestedApis)
            for (let nestedApi of api.nestedApis)
                resource[nestedApi.route] = await nestedApi.mapEntitiesToResources(entity[nestedApi.route]);
    }
}