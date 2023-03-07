import IRequest from "../mediator/interfaces/request";
import Result from "../mediator/Data/result";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<TRequest extends IRequest<TValue>, TValue>
    implements IRequestHandler<TRequest, TValue>{

    async handle(request: TRequest, result: Result<TValue>, next: Function, mediator: IMediator) {
        console.log(request.constructor.name + ":" + JSON.stringify(request));
        await next();
        if (result.isFailed())
            console.log("errors: " + result.errors.map(e => e.message));
        else
            console.log("result: " + JSON.stringify(result.value));
    }
}