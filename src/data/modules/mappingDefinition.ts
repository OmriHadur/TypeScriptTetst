
export default class MappingDefinition {
	createToEntity: any;
	alterToEntity: any;
	entityToResource: any;
	entitiesToResources: any;

	constructor() {
		this.createToEntity = {};
		this.alterToEntity = {};
		this.entityToResource = {};
		this.entitiesToResources = {};
	}
}