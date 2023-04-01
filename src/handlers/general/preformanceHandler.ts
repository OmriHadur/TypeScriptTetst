import consoleWrite from "../../general/consoleWrite";
import Stopwatch from "../../general/stopwatch";
import Request from "../../mediator/Data/request";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class PreformanceHandler<
	TRequest extends Request<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private stopwatchs: any = {};

	preHandling(request: TRequest): void {
		this.stopwatchs[request.requestId] = new Stopwatch();
	}

	postHandling?(request: TRequest): void {
		const elapsedTime = this.stopwatchs[request.requestId].stop();
		consoleWrite(request, "time", elapsedTime);
		delete this.stopwatchs[request.requestId];
	}
}
