import ApiRequest from "../data/apiRequest";

export type GetRequestFunction = (req: ExpressRequest) => ApiRequest<any>;

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