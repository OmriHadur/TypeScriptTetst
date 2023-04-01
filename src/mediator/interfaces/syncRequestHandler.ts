import IMediator from "./mediator";
import Result from "../Data/result";
import Request from "../Data/request";

export default interface ISyncRequestHandler<TRequest extends Request<TValue>, TValue> {
	messegeType?: string;

	preHandling?(request: TRequest): void;

	validate?(messege: TRequest, mediator: IMediator): Error | void;

	handle?(messege: TRequest, result: Result<TValue>, mediator: IMediator): void;

	postHandling?(request: TRequest, result: Result<TValue>): void;
}