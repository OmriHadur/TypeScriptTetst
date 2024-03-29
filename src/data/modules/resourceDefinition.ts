import DatabaseDefinition from "./databaseDefinition";
import MappingDefinition from "./mappingDefinition";
import PropertiesDefinition from "./propertiesDefinition";
import ValidationDefinition from "./validationDefinition";

export default class ResourceDefinition {
	properties: PropertiesDefinition;
	database: DatabaseDefinition;
	mapping: MappingDefinition;
	validation!: ValidationDefinition;
	postCreate!: any;
	postAlter!: any;

	constructor(public name: string) {
		this.properties = new PropertiesDefinition();
		this.mapping = new MappingDefinition();
		this.database = new DatabaseDefinition(null, null);
	}
}