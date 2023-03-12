import mongoose from 'mongoose';
import ApiDefinition from '../data/apiDefinition';
import Dictionary from '../general/dictionary';
const Scheme = mongoose.Schema;

export default function (apiFolder: Dictionary<any>, schemes: Dictionary<any>): ApiDefinition[] {
	const apiJDefinitions: ApiDefinition[] = [];
	Object.entries(apiFolder).forEach(([apiRoute, apiDefinition]) => {
		apiDefinition.route = apiRoute;
		const entity: Dictionary<string> = apiDefinition.types.entity;
		Object.entries(entity).forEach(([key, value]) => {
			if (schemes[value])
				entity[key] = schemes[value];
		});
		apiDefinition.module = entityToModule(apiRoute, entity);
		addCreateUnionAlter(apiDefinition);
		apiJDefinitions.push(apiDefinition);
	});
	return apiJDefinitions;
};

function entityToModule(route: string, entityDefinition: any) {
	const scheme = new Scheme(entityDefinition);
	return mongoose.model(route, scheme);
}

function addCreateUnionAlter(apiDefinition: ApiDefinition) {
	apiDefinition.types.createAndAlter = { ...apiDefinition.types.create, ...apiDefinition.types.alter };
	apiDefinition.validations.createAndAlter = { ...apiDefinition.validations.create, ...apiDefinition.validations.alter };
	apiDefinition.mapping.createAndAlterToEntity = { ...apiDefinition.mapping.createToEntity, ...apiDefinition.mapping.alterToEntity };
}

