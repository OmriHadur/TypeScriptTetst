import IRequest from "./interfaces/request";
import Result from "./Data/result";
import Dictionary from "../general/dictionary";
import Unit from "./Data/unit";
import IMediator from "./interfaces/mediator";

export default class Mediator implements IMediator {
	handlers: Dictionary<any[]>;
	generalHandlers: any[];

	constructor(handlers: Dictionary<any[]>) {
		this.handlers = handlers;
		this.generalHandlers = handlers["*"];
	}

	async send<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<Result<TValue>> {
		const typeName = request.constructor.name;
		const handlers = this.generalHandlers.concat(this.handlers[typeName]);
		const result = new Result<TValue>();
		let isFinished = false;

		for (let handler of handlers)
			if (handler.preHandling)
				handler.preHandling(request);

		for (let handler of handlers) {
			if (!isFinished && handler.validate) {
				result.error = await handler.validate(request, this);
				isFinished = result.isError();
			}
		}
		for (let handler of handlers) {
			if (!isFinished && handler.handle) {
				await handler.handle(request, result, this);
				isFinished = result.isResult();
			}
		}
		if (!result.isResult() && !result.isError())
			result.value = Unit.Instance as TValue;
		for (let handler of handlers)
			if (handler.postHandling)
				handler.postHandling(request, result);

		return result;
	}

	async sendValue<TRequest extends IRequest<TValue>, TValue>(request: TRequest): Promise<TValue> {
		return (await this.send(request)).value as TValue;
	}
}