import ApiContex from "../../data/apiContex"
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Dictionary from "../../general/dictionary"
import Request from "../../mediator/Data/request";

export default class GetApiContexReqeust extends Request<ApiContex> {
    constructor(public serverDefinitions: ServerDefinitions, public distFolder: Dictionary<any>) {
        super();
    }
}