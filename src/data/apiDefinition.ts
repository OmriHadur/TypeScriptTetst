import MappingsDefinition from "./mappingsDefinition";
import TypesDefinition from "./typesDefinition";
import ValidationsDefinition from "./validationsDefinition";

export default class ApiDefinition {
    route: string;
    types: TypesDefinition;
    mapping: MappingsDefinition;
    validations: ValidationsDefinition;
    module?: any;
    mapCreateToEntity?: any;
    mapAlterToEntity?: any;
    mapEntityToResource?: any;
    mapEntitiesToResources?: any;
    validateCreate?: any;
    validateReplace?: any;
    validateUpdate?: any;

    constructor(route: string,
        types: TypesDefinition,
        mapping: MappingsDefinition,
        validations: ValidationsDefinition) {
        this.route = route;
        this.types = types;
        this.mapping = mapping;
        this.validations = validations;
    }
}