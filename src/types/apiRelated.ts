import IRequest from "../mediator/interfaces/request";


export type GetRequestFunction = (req: ExpressRequest) => IRequest<any>;

export type ExpressRequest = {
    body: any;
    params: any;
}

export type GetStatusCode = (request: any) => number;