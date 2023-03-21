import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import getMessegesHandlers from "./mediator/getMessegesHandlers";
import Mediator from "./mediator/mediator";
import folderFactory from "./factories/folderFactory";
import AddRoutesReqeust from "./messeges/api/routes/addRoutesReqeust";
import ServerDefinitions from "./data/modules/serverDefinitions";
import GetServerConfigRequest from "./messeges/bootstrap/getServerConfigRequest";
import ServerConfig from "./data/input/serverConfig";
import GetServerDefinitionsRequest from "./messeges/bootstrap/getServerDefinitionsRequest";
import GetApiContexReqeust from "./messeges/bootstrap/getApiContexReqeust";
import ApiContex from "./data/apiContex";
import AddValidationAndMappingRequest from "./messeges/bootstrap/AddValidationAndMappingRequest";
import * as staticObjects from './general/staticObjects';
import * as sendToMediator from './controllers/sendToMediator';

const asyncFunction = async () => {

	const distFolder = folderFactory("./dist", "../");
	const messegesHandlers = await getMessegesHandlers(distFolder.handlers);
	const mediator = new Mediator(messegesHandlers);

	const serverConfig = await mediator.sendValue(new GetServerConfigRequest("Configs/")) as ServerConfig;
	const serverDefinitions = await mediator.sendValue(new GetServerDefinitionsRequest(serverConfig)) as ServerDefinitions;
	const apiContex = await mediator.sendValue(new GetApiContexReqeust(serverDefinitions.apis, distFolder)) as ApiContex;
	staticObjects.set(apiContex);
	sendToMediator.setApiContex(apiContex);
	await mediator.sendValue(new AddValidationAndMappingRequest(serverDefinitions, serverConfig, apiContex));

	const app = express();

	app.use(bodyParser.json());

	await mediator.send(new AddRoutesReqeust(app, serverDefinitions.apis));

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