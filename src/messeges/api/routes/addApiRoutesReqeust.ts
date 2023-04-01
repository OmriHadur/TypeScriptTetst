import { Router } from "express";
import ApiDefinition from "../../../data/modules/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/Data/request";

export default class AddApiRoutesReqeust extends Request<Unit> {
    constructor(public router: Router, public api: ApiDefinition) {
        super();
    }
}