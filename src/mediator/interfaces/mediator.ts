
import Request from "../Data/request";
import Result from "../Data/result";


export default interface IMediator {
    send<TRequest extends Request<TValue>, TValue>(request: TRequest): Promise<Result<TValue>>;
    sendValue<TRequest extends Request<TValue>, TValue>(request: TRequest): Promise<TValue>;

    sendSync<TRequest extends Request<TValue>, TValue>(request: TRequest): Result<TValue>;
}