import ApiContex from "../../data/apiContex"
import ResourceConfig from "../../data/input/resourceConfig";
import ValidationDefinition from "../../data/modules/validationDefinition";
import Request from "../../mediator/interfaces/request"


export default class GetValidationDefinitionRequest extends Request<ValidationDefinition> {
    constructor(public resourceConfig: ResourceConfig, public apiContex: ApiContex, public functions: any) {
        super();
    }
}