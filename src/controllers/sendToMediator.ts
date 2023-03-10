import IMediator from "../mediator/interfaces/mediator";
import { GetRequestFunction } from "../types/apiRelated";

export default function (mediator: IMediator, getRequest: GetRequestFunction, statusCode: number = 200) {
    return async (req: any, res: any, next: any) => {
        const result = await mediator.send(getRequest(req));
        if (result.isSuccess())
            res.status(statusCode).json(result.value);
        else
            next(result.error);
    }
}