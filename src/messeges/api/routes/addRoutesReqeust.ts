import ApiDefinition from "../../../data/modules/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/interfaces/request";

export default class AddRoutesReqeust extends Request<Unit> {
    constructor(public expressApp: any, public apiDefinitions: ApiDefinition[]) {
        super();
    }
}