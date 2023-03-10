import * as fs from 'fs';

const root = './dist/validations/';
const files = fs.readdirSync(root);

export default function () {
	const functions: any = {};
	files.forEach(fileName => {
		if (fileName.endsWith('.js')) {
			const functionFile = require("../validations/" + fileName);
			Object.entries(functionFile).forEach(([key, func]) => functions[key] = func);
		}
	});
	return functions;
}