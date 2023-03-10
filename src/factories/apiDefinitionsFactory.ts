import * as fs from 'fs';
import mongoose from 'mongoose';
import ApiDefinition from '../data/apiDefinition';
const Scheme = mongoose.Schema;

const encoding = 'utf8';

export default function (apiFolder: string): ApiDefinition[] {
	const files = fs.readdirSync(apiFolder);
	const apiJDefinitions: ApiDefinition[] = [];
	files.forEach(fileName => {
		const apiDefinition = fileNameToObject(apiFolder, fileName);
		const route = fileName.substring(0, fileName.length - 5);
		apiDefinition.route = route;
		apiDefinition.module = entityToModule(apiDefinition.types.entity, route);
		apiJDefinitions.push(apiDefinition);
	});
	return apiJDefinitions;
};

const fileNameToObject = (root: string, fileName: string) => {
	const file = fs.readFileSync(root + fileName, encoding);
	return JSON.parse(file);
}

const entityToModule = (entityDefinition: any, route: string) => {
	const scheme = new Scheme(entityDefinition);
	return mongoose.model(route, scheme);
}

