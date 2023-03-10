import Dictionary from "../general/dictionary";

export default class MappingsDefinition {
	createToEntity?: Dictionary<string>;
	alterToEntity?: Dictionary<string>;
	toResource?: Dictionary<string>;
}