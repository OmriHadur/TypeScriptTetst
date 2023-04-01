import IMediator from "./mediator";
import Result from "../Data/result";
import Request from "../Data/request";

export default interface IRequestHandler<TRequest extends Request<TValue>, TValue> {
	messegeType?: string;

	preHandling?(request: TRequest): void;

	validate?(messege: TRequest, mediator: IMediator): Promise<Error | void>;

	handle?(messege: TRequest, result: Result<TValue>, mediator: IMediator): Promise<void>;

	postHandling?(request: TRequest, result: Result<TValue>): void;
}