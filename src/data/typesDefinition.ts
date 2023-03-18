import Dictionary from "../general/dictionary";

export default class TypesDefinition {
	create: Dictionary<string>;
	alter: Dictionary<string>;
	entity: Dictionary<string>;
	unique: string[];
	resource: Dictionary<string>;

	constructor() {
		this.create = {};
		this.alter = {};
		this.entity = {};
		this.unique = [];
		this.resource = {};
	}
}