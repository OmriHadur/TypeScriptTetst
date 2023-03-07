import IRequest from "./request";
import Result from "../Data/result";
import { HandlingPriority } from "../handlingPriority";
import IMediator from "./mediator";

export default interface IRequestHandler<TRequest extends IRequest<TValue>, TValue> {
    messegeType?: string;

    priority?: HandlingPriority;

    handle(messege: TRequest, result: Result<TValue>, next: Function, mediator: IMediator): Promise<void>;
}