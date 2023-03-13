import IRequest from "./interfaces/request";
import Result from "./Data/result";
import Dictionary from "../general/dictionary";

export default class Mediator {
	handlers: Dictionary<any>;

	constructor(handlers: Dictionary<any>) {
		this.handlers = handlers;
	}

	async send<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<Result<TValue>> {
		const typeName = request.constructor.name;
		const handler = this.handlers[typeName];

		const handleFunctin = handler(request, this);
		const value = await handleFunctin();
		return new Result<TValue>(value);
	}
	
	async sendValue<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<TValue> {
		return (await this.send(request)).value as TValue;
	}
}