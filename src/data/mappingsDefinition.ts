import Dictionary from "../general/dictionary";

export default class MappingsDefinition {
	createToEntity?: Dictionary<string>;
	createAndAlterToEntity?: Dictionary<string>;
	alterToEntity?: Dictionary<string>;
	entityToResource?: Dictionary<string>;
}