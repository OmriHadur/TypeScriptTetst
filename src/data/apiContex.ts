import IMediator from "../mediator/interfaces/mediator";

export default class ApiContex {
	user?: any;
	variables: any;
	input?: any;
	entity?: any;

	constructor(public routes: any, public functions: any, public validations: any, public mediator: IMediator) {
		this.variables = {};
	}
}