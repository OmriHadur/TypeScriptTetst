import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import getMessegesHandlers from "./mediator/getMessegesHandlers";
import Mediator from "./mediator/mediator";
import { readFolder } from "./factories/folderReader";
import dataSchemeFactory from "./factories/dataSchemeFactory";
import ApiDefinition from "./data/apiDefinition";
import GetApiContexReqeust from "./messeges/bootstrap/getApiContexReqeust";
import ApiContex from "./data/apiContex";
import GetApiDefinitionsReqeust from "./messeges/bootstrap/getApiDefinitionsReqeust";
import AddRoutesReqeust from "./messeges/api/routes/addRoutesReqeust";
import AddApiMappingTaskReqeust from "./messeges/bootstrap/addApiMappingTaskReqeust";
import AddApiValidationsTaskReqeust from "./messeges/bootstrap/addApiValidationsTaskReqeust";

const asyncFunction = async () => {

	const distFolder = readFolder("./dist", "../");
	const messegesHandlers = await getMessegesHandlers(distFolder.handlers);
	const mediator = new Mediator(messegesHandlers);

	const configs = readFolder("Configs/");
	const schemes = dataSchemeFactory(configs.data);
	const apiDefinitions: ApiDefinition[] = await mediator.sendValue(new GetApiDefinitionsReqeust(configs.api, schemes));
	const apiContex: ApiContex = await mediator.sendValue(new GetApiContexReqeust(apiDefinitions, distFolder.functions));

	await mediator.send(new AddApiMappingTaskReqeust(apiDefinitions, apiContex));
	await mediator.send(new AddApiValidationsTaskReqeust(apiDefinitions, apiContex, distFolder.validations));

	const app = express();

	app.use(bodyParser.json());

	await mediator.send(new AddRoutesReqeust(app, apiDefinitions));

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