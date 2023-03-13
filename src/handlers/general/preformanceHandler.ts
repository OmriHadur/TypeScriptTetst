import Stopwatch from "../../general/stopwatch";
import IRequest from "../../mediator/interfaces/request";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class PreformanceHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private stopwatchs: any = {};

	preHandling(request: TRequest): void {
		this.stopwatchs[request] = new Stopwatch();
	}

	postHandling?(request: TRequest): void {
		const elapsedTime = this.stopwatchs[request].stop();
		console.log(`took ${elapsedTime} ms`);
		delete this.stopwatchs[request];
	}
}
