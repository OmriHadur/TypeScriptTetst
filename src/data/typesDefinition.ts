import Dictionary from "../general/dictionary";

export default class TypesDefinition {
	create?: Dictionary<string>;
	alter?: Dictionary<string>;
	createAndAlter?: Dictionary<string>;
	entity?: Dictionary<string>;
	resource?: Dictionary<string>;
}