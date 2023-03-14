import IRequest from "./request";
import Result from "../Data/result";


export default interface IMediator {
    send<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<Result<TValue>>;
    sendValue<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<TValue>;
}