import CircularJSON from "circular-json";
import consoleWrite from "../../general/consoleWrite";
import Request from "../../mediator/Data/request";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<
	TRequest extends Request<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	private isFull: boolean = false;

	preHandling(request: TRequest): void {
		consoleWrite(request, "started", this.isFull ? request : null);
	}

	postHandling?(request: TRequest, result: Result<TValue>): void {
		const event = result.error ? "error" : "finished";
		const content = this.isFull ? (result.error ? result.error.message : result.value) : null;
		consoleWrite(request, event, content);
	}
}
