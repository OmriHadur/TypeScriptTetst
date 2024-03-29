import Result from "./Data/result";
import Dictionary from "../general/dictionary";
import Unit from "./Data/unit";
import IMediator from "./interfaces/mediator";
import InternalError from "../errors/internalError";
import Request from "./Data/request";

export default class Mediator implements IMediator {
	handlers: Dictionary<any[]>;
	generalHandlers: any[];

	constructor(handlers: Dictionary<any[]>) {
		this.handlers = handlers;
		this.generalHandlers = handlers["*"];
	}
	sendSync<TRequest extends Request<TValue>, TValue>(request: TRequest): Result<TValue> {
		const typeName = request.constructor.name;
		const handlers = this.generalHandlers.concat(this.handlers[typeName]);
		const result = new Result<TValue>();
		let isFinished = false;

		try {
			for (let handler of handlers)
				if (handler.preHandling)
					handler.preHandling(request);

			for (let handler of handlers) {
				if (!isFinished && handler.validate) {
					result.error = handler.validate(request, this);
					isFinished = result.isError();
				}
			}
			for (let handler of handlers) {
				if (!isFinished && handler.handle) {
					handler.handle(request, result, this);
					isFinished = result.isResult();
				}
			}
			if (!result.isResult() && !result.isError())
				result.value = Unit.Instance as TValue;
			for (let handler of handlers)
				if (handler.postHandling)
					handler.postHandling(request, result);
		}
		catch (exp: any) {
			result.error = new InternalError(exp.message);
		}
		return result;
	}

	async send<TRequest extends Request<TValue>, TValue>(request: TRequest): Promise<Result<TValue>> {
		const typeName = request.constructor.name;
		const handlers = this.generalHandlers.concat(this.handlers[typeName]);
		const result = new Result<TValue>();
		let isFinished = false;

		try {
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
			for (let handler of handlers)
				if (handler.postHandling)
					handler.postHandling(request, result);
		}
		catch (exp: any) {
			result.error = new InternalError(exp.message);
			console.log(exp);
		}
		return result;
	}

	async sendValue<TRequest extends Request<TValue>, TValue>(request: TRequest): Promise<TValue> {
		return (await this.send(request)).value as TValue;
	}
}