import Dictionary from "../../general/dictionary";
import ResourceConfig from "./resourceConfig";

export default class ApiConfig {
	nested: Dictionary<ResourceConfig>;
	constructor(public input: ResourceConfig) {
		this.nested = new Dictionary<ResourceConfig>();
	}
}