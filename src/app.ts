import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import getMessegesHandlers from "./mediator/getMessegesHandlers";
import Mediator from "./mediator/mediator";
import folderFactory from "./factories/folderFactory";
import dataSchemeFactory from "./factories/dataSchemeFactory";
import ApiDefinition from "./data/apiDefinition";
import GetApiContexReqeust from "./messeges/bootstrap/getApiContexReqeust";
import ApiContex from "./data/apiContex";
import GetApiDefinitionsReqeust from "./messeges/bootstrap/getApiDefinitionsReqeust";
import AddRoutesReqeust from "./messeges/api/routes/addRoutesReqeust";
import AddApiMappingTaskReqeust from "./messeges/bootstrap/addApiMappingTaskReqeust";
import AddApiValidationsTaskReqeust from "./messeges/bootstrap/addApiValidationsTaskReqeust";
import GetNestedApiDefinitionsReqeust from "./messeges/bootstrap/getNestedApiDefinitionsReqeust";
import Dictionary from "./general/dictionary";

const asyncFunction = async () => {

	const distFolder = folderFactory("./dist", "../");
	const messegesHandlers = await getMessegesHandlers(distFolder.handlers);
	const mediator = new Mediator(messegesHandlers);

	const configs = folderFactory("Configs/");
	const dataSchemes = dataSchemeFactory(configs.data);
	const nested: Dictionary<ApiDefinition[]> = await mediator.sendValue(new GetNestedApiDefinitionsReqeust(configs.api, dataSchemes));
	const apiDefinitions: ApiDefinition[] = await mediator.sendValue(new GetApiDefinitionsReqeust(configs.api, dataSchemes, nested));
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