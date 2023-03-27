import ResourceValidationDefinition from "./resourceValidationDefinition";

export default class ValidationDefinition {
	constructor(
		public create: ResourceValidationDefinition,
		public replace: ResourceValidationDefinition,
		public update: ResourceValidationDefinition) { }
}