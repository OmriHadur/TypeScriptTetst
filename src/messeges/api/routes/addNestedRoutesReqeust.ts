import ApiDefinition from "../../../data/modules/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/Data/request";

export default class addNestedRoutesReqeust extends Request<Unit> {
    constructor(public expressApp: any, public apiDefinitions: ApiDefinition[]) {
        super();
    }
}