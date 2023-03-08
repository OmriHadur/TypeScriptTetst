import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import apiDefinitionsFactory from "./factories/apiDefinitionsFactory";
import * as apisContext from "./helpers/apisContext";

import addAllRoutes from "./routes/AllRoutes";
import mappingTask from "./tasks/mappingTask";
import validationsTask from "./tasks/validationsTask";

const functionsFolder = './dist/functions';
const functionsImportFolder = "../functions/";

const apiDefinitions = apiDefinitionsFactory("Api/");
apisContext.init(apiDefinitions, functionsFolder, functionsImportFolder).then(() => {
    mappingTask(apiDefinitions);
    validationsTask(apiDefinitions);
    const app = express();

    app.use(bodyParser.json());

    const router = addAllRoutes(apiDefinitions);

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
});