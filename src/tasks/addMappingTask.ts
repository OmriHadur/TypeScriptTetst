import ApiDefinition from "../data/apiDefinition";
import * as apisContext from "../helpers/apisContext"
import * as scriptsBuilder from '../helpers/scriptsBuilder';

export default function (apiDefinitions: ApiDefinition[]) {
	apiDefinitions.forEach(apiDefinition => {
		const createScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.createAndAlterToEntity);
		apiDefinition.mapCreateToEntity =
			(createResource: any) => map(createResource, apiDefinition.types.createAndAlter, createScripts);

		const alterScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.alterToEntity);
		apiDefinition.mapAlterToEntity =
			(alterResource: any) => map(alterResource, apiDefinition.types.alter, alterScripts);

		const resourceScripts = scriptsBuilder.definitionToScript(apiDefinition.mapping.toResource);
		apiDefinition.mapEntityToResource =
			(entity: any) => map(entity, apiDefinition.types.resource, resourceScripts);

		apiDefinition.mapEntitiesToResources = async (entities: any[]) => {
			const resourceMapping = entities.map(async (entity: any) => await apiDefinition.mapEntityToResource(entity));
			return await Promise.all(resourceMapping);
		}
	});
}

const map = async (input: any, entityType: any, scripts: any) => {
	const output: any = {};
	const context = { ...apisContext.get(), input: input };
	for (let propertyScript in scripts)
		output[propertyScript] = await scriptsBuilder.runScript(scripts[propertyScript], context)
	return output;
};


