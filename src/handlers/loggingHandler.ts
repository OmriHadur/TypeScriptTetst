import IRequest from "../mediator/interfaces/request";
import IRequestHandler from "../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = false;

	handle = async (request: TRequest, next: Function): Promise<TValue | Error> => {
		const name = request.constructor.name;
		if (this.isFull)
			console.log(name + ":" + JSON.stringify(request));
		else
			console.log(name + " started");

		const value = await next();

		if (value instanceof Error)
			console.log(name + " errors: " + value.message);
		else {
			if (this.isFull)
				console.log(name + " finished, result: " + JSON.stringify(value.value));
			else console.log(name + " finished");
		}
		return value;
	};
}
