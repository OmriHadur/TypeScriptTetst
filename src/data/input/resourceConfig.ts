import Dictionary from "../../general/dictionary";
import InputConfig from "./inputConfig";

export default class ResourceConfig {
	constructor(
		public create: InputConfig,
		public alter: InputConfig,
		public resource: Dictionary<string>
	) { }
}