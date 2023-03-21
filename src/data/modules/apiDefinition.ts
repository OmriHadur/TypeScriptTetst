
import ResourceDefinition from "./resourceDefinition";

export default class ApiDefinition extends ResourceDefinition {
	nested: ResourceDefinition[];

	constructor(name: string) {
		super(name);
		this.nested = [];
	}
}