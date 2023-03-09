import express from 'express';
import crudRoutes from "../routes/crud";

export default function (modulesData: any) {
    const router = express.Router();
    modulesData.forEach((moduleData: any) => {
        crudRoutes(router, moduleData);
    });
    return router;
};