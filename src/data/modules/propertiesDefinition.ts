import Dictionary from "../../general/dictionary";

export default class PropertiesDefinition {
	create: string[];
	alter: string[];
	entity: string[];
	unique: string[];
	resource: string[];

	constructor() {
		this.create = [];
		this.alter = [];
		this.entity = [];
		this.unique = [];
		this.resource = [];
	}
}