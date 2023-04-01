import ApiDefinition from "../../../data/modules/apiDefinition";
import Request from "../../../mediator/Data/request";
import Unit from "../../../mediator/Data/unit";

export default class AddRoutesReqeust extends Request<Unit> {
    constructor(public expressApp: any, public apiDefinitions: ApiDefinition[]) {
        super();
    }
}