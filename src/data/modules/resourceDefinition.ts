import DatabaseDefinition from "./databaseDefinition";
import MappingDefinition from "./mappingDefinition";
import TypesDefinition from "./typesDefinition";
import ValidationDefinition from "./validationDefinition";

export default class ResourceDefinition {
	types: TypesDefinition;
	database: DatabaseDefinition;
	mapping: MappingDefinition;
	validation: ValidationDefinition;

	constructor(public name: string) {
		this.types = new TypesDefinition();
		this.mapping = new MappingDefinition();
		this.validation = new ValidationDefinition();
		this.database = new DatabaseDefinition();
	}
}