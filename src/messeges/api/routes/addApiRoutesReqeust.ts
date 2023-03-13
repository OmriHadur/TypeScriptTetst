import { Router } from "express";
import ApiDefinition from "../../../data/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/interfaces/request";

export default class AddApiRoutesReqeust extends Request<Unit> {
    constructor(public router: Router, public api: ApiDefinition) {
        super();
    }
}