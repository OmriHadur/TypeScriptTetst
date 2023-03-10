import IRequest from "./request";
import { HandlingPriority } from "../handlingPriority";
import IMediator from "./mediator";

export default interface IRequestHandler<TRequest extends IRequest<TValue>, TValue> {
	messegeType?: string;

	priority?: HandlingPriority;

	handle(messege: TRequest, next: Function, mediator: IMediator): Promise<TValue | Error>;
}