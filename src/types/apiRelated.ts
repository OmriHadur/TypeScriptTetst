import Result from "../mediator/Data/result";
import IRequest from "../mediator/interfaces/request";

export type GetRequestFunction = (req: ExpressRequest) => IRequest<any>;

export type ExpressRequest = {
    body: any;
    params: any;
}

export type Resource = {
    id: string;
}

export type GetStatusCode = (request: any) => number;