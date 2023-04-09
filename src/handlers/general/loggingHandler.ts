import consoleWrite from "../../general/consoleWrite";
import Request from "../../mediator/Data/request";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends Request<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = true;

	preHandling(request: TRequest): void {
		consoleWrite(request, "started", this.isFull ? request : null);
	}

	postHandling?(request: TRequest, result: Result<TValue>): void {
		const event = result.error ? "error" : "finished";
		const content = result.error ? result.error : (this.isFull ? result.value : null);
		consoleWrite(request, event, content);
	}
}
