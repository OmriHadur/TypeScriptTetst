import ResourceConfig from "../../data/input/resourceConfig";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import ValidationDefinition from "../../data/modules/validationDefinition";
import Request from "../../mediator/interfaces/request"

export default class AddToDefinitionRequest extends Request<ValidationDefinition> {
    constructor(public resourceDefinition: ResourceDefinition, public resourceConfig: ResourceConfig, public server: ServerDefinitions) {
        super();
    }
}