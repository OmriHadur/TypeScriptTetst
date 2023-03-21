import ResourceConfig from "../../data/input/resourceConfig";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import Dictionary from "../../general/dictionary";
import Request from "../../mediator/interfaces/request"

export default class GetResourceDefinitionRequest extends Request<ResourceDefinition> {
    constructor(public name: string, public resourceConfig: ResourceConfig, public schemes: Dictionary<any>) {
        super();
    }
}