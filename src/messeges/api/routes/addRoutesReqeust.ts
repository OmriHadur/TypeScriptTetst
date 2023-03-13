import ApiDefinition from "../../../data/apiDefinition";
import Unit from "../../../mediator/Data/unit";
import Request from "../../../mediator/interfaces/request";

export default class AddRoutesReqeust extends Request<Unit> {
    constructor(public expressApp: any, public apiDefinitions: ApiDefinition[]) {
        super();
    }
}