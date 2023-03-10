import IRequest from "../mediator/interfaces/request";
import Result from "../mediator/Data/result";
import IRequestHandler from "../mediator/interfaces/requestHandler";

export default class LogginMessegeHandler<TRequest extends IRequest<TValue>, TValue>
    implements IRequestHandler<TRequest, TValue>{

    isFull: boolean = false;

    handle = async (request: TRequest, result: Result<TValue>, next: Function) => {
        const name = request.constructor.name;
        if (this.isFull)
            console.log(name + ":" + JSON.stringify(request));
        else
            console.log(name + " started");

        await next();

        if (result.isFailed())
            console.log(name + " errors: " + result.error!.message);
        else {
            if (this.isFull)
                console.log(name + " finished, result: " + JSON.stringify(result.value));
            else
                console.log(name + " finished");
        }
    }
}