import * as fs from 'fs';
import mongoose from 'mongoose';
import ApiDefinition from '../data/apiDefinition';
const Scheme = mongoose.Schema;

const encoding = 'utf8';

export default function (apiFolder: string): ApiDefinition[] {
	const files = fs.readdirSync(apiFolder);
	const apiJDefinitions: ApiDefinition[] = [];
	files.forEach(fileName => {
		const apiDefinition = fileNameToObject(apiFolder, fileName) as ApiDefinition;
		const route = fileName.substring(0, fileName.length - 5);
		apiDefinition.route = route;
		apiDefinition.module = entityToModule(apiDefinition.types.entity, route);
		addCreateUnionAlter(apiDefinition);
		apiJDefinitions.push(apiDefinition);
	});
	return apiJDefinitions;
};

function fileNameToObject(root: string, fileName: string) {
	const file = fs.readFileSync(root + fileName, encoding);
	return JSON.parse(file);
}

function entityToModule(entityDefinition: any, route: string) {
	const scheme = new Scheme(entityDefinition);
	return mongoose.model(route, scheme);
}

function addCreateUnionAlter(apiDefinition: ApiDefinition) {
	apiDefinition.types.createAndAlter = { ...apiDefinition.types.create, ...apiDefinition.types.alter };
	apiDefinition.validations.createAndAlter = { ...apiDefinition.validations.create, ...apiDefinition.validations.alter };
	apiDefinition.mapping.createAndAlterToEntity = { ...apiDefinition.mapping.createToEntity, ...apiDefinition.mapping.alterToEntity };
}

