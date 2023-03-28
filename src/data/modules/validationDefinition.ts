import ResourceValidationDefinition from "./resourceValidationDefinition";

export default class ValidationDefinition {
	constructor(
		public create: ResourceValidationDefinition,
		public alter: ResourceValidationDefinition) { }
}