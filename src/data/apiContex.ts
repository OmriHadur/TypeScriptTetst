
export default class ApiContex {
	user?: any;
	variables?: any;
	input?: any;
	entity?: any;
	isValidateUndefined: boolean = true;
	constructor(public modules: any, public functions: any, public validations: any) {
	}
}