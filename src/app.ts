import express, { Request } from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import apiDefinitionsFactory from "./factories/apiDefinitionsFactory";
import { init } from "./helpers/apisContext";

import addAllRoutes from "./tasks/addAllRoutesTask";
import addMappingTask from "./tasks/addMappingTask";
import addValidationsTask from "./tasks/addValidationsTask";
import getMessegesHandlers from "./mediator/getMessegesHandlers";
import getMessegesHandling from "./mediator/getMessegesHandling";
import Mediator from "./mediator/mediator";
import { readFolder } from "./factories/folderReader";
import dataSchemeFactory from "./factories/dataSchemeFactory";

const asyncFunction = async () => {
	const configs = readFolder("Configs/");
	const distFolder = readFolder("./dist", "../");

	const schemes = dataSchemeFactory(configs.data);
	const apiDefinitions = apiDefinitionsFactory(configs.api,schemes);

	const messegesHandlers = await getMessegesHandlers(distFolder.handlers);
	const handlers = await getMessegesHandling(messegesHandlers);
	const mediator = new Mediator(handlers);

	await init(apiDefinitions, distFolder.functions);
	addMappingTask(apiDefinitions);
	addValidationsTask(apiDefinitions);
	const app = express();

	app.use(bodyParser.json());

	const router = addAllRoutes(apiDefinitions, mediator);

	app.use(router);

	app.use((error: any, req: any, res: any, next: any) => {
		const status = error.status || 500;
		res.status(status).json(error);
	});

	const MONGO_URI = 'mongodb+srv://admin:5LHVc4pYR4qblXXS@cluster0.3cfpkbx.mongodb.net/nodetest';
	mongoose.connect(MONGO_URI)
		.then(() => {
			console.log("conncted to DB");
			app.listen(3000);
		})
		.catch(err => console.log(err));
};
asyncFunction();