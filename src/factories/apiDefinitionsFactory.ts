import * as fs from 'fs';
import mongoose from 'mongoose';
const Scheme = mongoose.Schema;

const encoding = 'utf8';

export default function (root: string) {
    const files = fs.readdirSync(root);
    const apiJDefinitions: any = [];
    files.forEach(fileName => {
        const apiDefinition = fileNameToObject(root, fileName);
        const route = fileName.substring(0, fileName.length - 5);
        apiDefinition.route = route;
        const module = entityToModule(apiDefinition.types.entity, route);
        apiJDefinitions.push({ ...apiDefinition, module });
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

