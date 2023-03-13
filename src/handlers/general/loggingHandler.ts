import Result from "../../mediator/Data/result";
import IRequest from "../../mediator/interfaces/request";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = false;

	preHandling(request: TRequest): void {
		const name = request.constructor.name;
		if (this.isFull)
			console.log(name + ":" + JSON.stringify(request));
		else
			console.log(name + " started");
	}

	postHandling?(request: TRequest, result: Result<TValue>): void {
		const name = request.constructor.name;
		if (result.error)
			console.log(name + " errors: " + result.error.message);
		else {
			if (this.isFull)
				console.log(name + " finished, result: " + JSON.stringify(result.value));
			else
				console.log(name + " finished");
		}
	}
}
