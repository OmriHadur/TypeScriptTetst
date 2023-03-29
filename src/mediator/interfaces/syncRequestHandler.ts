import IRequest from "./request";
import IMediator from "./mediator";
import Result from "../Data/result";

export default interface ISyncRequestHandler<TRequest extends IRequest<TValue>, TValue> {
	messegeType?: string;

	preHandling?(request: TRequest): void;

	validate?(messege: TRequest, mediator: IMediator): Error | void;

	handle?(messege: TRequest, result: Result<TValue>, mediator: IMediator): void;

	postHandling?(request: TRequest, result: Result<TValue>): void;
}