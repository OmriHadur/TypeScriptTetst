import DatabaseDefinition from "./databaseDefinition";
import MappingDefinition from "./mappingDefinition";
import PropertiesDefinition from "./propertiesDefinition";
import ValidationDefinition from "./validationDefinition";

export default class ResourceDefinition {
	properties: PropertiesDefinition;
	database: DatabaseDefinition;
	mapping: MappingDefinition;
	validation: ValidationDefinition;

	constructor(public name: string) {
		this.properties = new PropertiesDefinition();
		this.mapping = new MappingDefinition();
		this.validation = new ValidationDefinition();
		this.database = new DatabaseDefinition();
	}
}