import ApiDefinition from "../../data/apiDefinition";
import Result from "../../mediator/Data/result";
import IRequest from "../../mediator/interfaces/request";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = true;

	preHandling(request: TRequest): void {
		let prefix = this.prefix(request);
		if (this.isFull)
			console.log(prefix + JSON.stringify(request, (key, value) => {
				if (value?.route)
					return value.route;
				return value;
			}));
		else
			console.log(prefix + " started");
	}

	postHandling?(request: TRequest, result: Result<TValue>): void {
		let prefix = this.prefix(request);
		if (result.error)
			console.log(prefix + " errors: " + result.error.message);
		else {
			if (this.isFull)
				console.log(prefix + " finished, result: " + JSON.stringify(result.value));
			else
				console.log(prefix + " finished");
		}
	}

	private prefix(request: TRequest) {
		return `${new Date().toISOString()} - ${request.constructor.name} - ${request.id}: `;
	}
}
