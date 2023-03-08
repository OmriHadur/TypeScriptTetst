import IRequest from "../mediator/interfaces/request";
import Result from "../mediator/Data/result";
import Stopwatch from "../general/stopwatch";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";

export default class PreformanceHandler<TRequest extends IRequest<TValue>, TValue>
    implements IRequestHandler<TRequest, TValue>{

    async handle(request: TRequest, result: Result<TValue>, next: Function, mediator: IMediator) {
        const sw = new Stopwatch();
        await next();
        const elapsed = sw.stop();
        console.log(`took ${elapsed} ms`);
    }
}