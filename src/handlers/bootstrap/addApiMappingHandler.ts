import Unit from "../../mediator/Data/unit";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';
import ApiContex from "../../data/apiContex";
import ApiDefinition from "../../data/apiDefinition";
import AddApiMappingReqeust from "../../messeges/bootstrap/addApiMappingReqeust";

export default class AddApiMappingHandler
    implements IRequestHandler<AddApiMappingReqeust, Unit>
{
    messegeType = AddApiMappingReqeust.name;

    async handle(request: AddApiMappingReqeust): Promise<Unit | Error> {
        request.apiDefinitions.forEach(api => this.addApiMapping(api, request.apiContex));
        return Unit.Instance;
    }

    async addApiMapping(apiDefinition: ApiDefinition, apiContex: ApiContex) {
        const createScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.createAndAlterToEntity);
        apiDefinition.mapCreateToEntity =
            (createResource: any) => this.map(createResource, apiDefinition.types.createAndAlter, createScripts, apiContex);

        const alterScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.alterToEntity);
        apiDefinition.mapAlterToEntity =
            (alterResource: any) => this.map(alterResource, apiDefinition.types.alter, alterScripts, apiContex);

        const resourceScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.entityToResource);
        apiDefinition.mapEntityToResource =
            (entity: any) => this.map(entity, apiDefinition.types.resource, resourceScripts, apiContex);

        apiDefinition.mapEntitiesToResources = async (entities: any[]) => {
            const resourceMapping = entities.map(async (entity: any) => await apiDefinition.mapEntityToResource(entity));
            await Promise.all(resourceMapping);
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
}