import IRequest from "../../mediator/interfaces/request";
import IRequestHandler from "../../mediator/interfaces/requestHandler";

export default class TokenHandler<
	TRequest extends IRequest<TValue>,
	TValue
> implements IRequestHandler<TRequest, TValue>
{
	preHandling(request: TRequest): void {
		
	}
}
