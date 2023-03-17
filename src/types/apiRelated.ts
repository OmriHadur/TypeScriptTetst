import IRequest from "../mediator/interfaces/request";


export type GetRequestFunction = (req: ExpressRequest) => IRequest<any>;

export type ExpressRequest = {
    body: any;
    params: any;
    query: any;
}

export type GetStatusCode = (request: any) => number;

export enum AlterOperation {
    Create,
    ReplaceOrCreate,
    Replace,
    Update
}