
export default class ValidationDefinition {
	create: any;
	replace: any;
	update: any;

	constructor() {
		this.create = {};
		this.replace = {};
		this.update = {};
	}
}