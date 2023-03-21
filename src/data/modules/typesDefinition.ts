import Dictionary from "../../general/dictionary";

export default class TypesDefinition {
	create: Dictionary<string>;
	alter: Dictionary<string>;
	entity: Dictionary<string>;
	unique: string[];
	resource: Dictionary<string>;

	constructor() {
		this.create = new Dictionary<string>();
		this.alter = new Dictionary<string>();
		this.entity = new Dictionary<string>();
		this.unique = [];
		this.resource = new Dictionary<string>();
	}
}