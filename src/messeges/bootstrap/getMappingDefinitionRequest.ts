import ApiContex from "../../data/apiContex"
import ResourceConfig from "../../data/input/resourceConfig";
import MappingDefinition from "../../data/modules/mappingDefinition";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import Request from "../../mediator/interfaces/request"


export default class GetMappingDefinitionRequest extends Request<MappingDefinition> {
    constructor(public resourceDefinition: ResourceDefinition, public resourceConfig: ResourceConfig, public apiContex: ApiContex) {
        super();
    }
}