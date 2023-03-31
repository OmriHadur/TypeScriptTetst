import Dictionary from "../../general/dictionary";

export default class InputConfig {
	constructor(
		public input: Dictionary<any>,
		public variables: Dictionary<string>,
		public validations: Dictionary<string>,
		public entity: Dictionary<any>,
		public post: Dictionary<string>
	) { }
}