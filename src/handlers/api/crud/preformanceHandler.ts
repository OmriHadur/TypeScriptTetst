import IRequest from "../../../mediator/interfaces/request";
import Stopwatch from "../../../general/stopwatch";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";

export default class PreformanceHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	async handle(request: TRequest, next: Function): Promise<TValue | Error> {
		const sw = new Stopwatch();
		const result = await next();
		const elapsed = sw.stop();
		console.log(`took ${elapsed} ms`);
		return result;
	}
}
