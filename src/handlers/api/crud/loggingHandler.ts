import IRequest from "../../../mediator/interfaces/request";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = false;

	async handle(request: TRequest, next: Function): Promise<TValue | Error> {
		const name = request.constructor.name;
		this.beforeHanlding(request, name);
		const value = await next();
		this.afterHanlding(value, name);
		return value;
	}

	private beforeHanlding(request: TRequest, name: string) {
		if (this.isFull)
			console.log(name + ":" + JSON.stringify(request));

		else
			console.log(name + " started");
	}

	private afterHanlding(value: any, name: string) {
		if (value instanceof Error)
			console.log(name + " errors: " + value.message);
		else {
			if (this.isFull)
				console.log(name + " finished, result: " + JSON.stringify(value.value));
			else
				console.log(name + " finished");
		}
	}
}
