import { v4 as uuidv4 } from 'uuid';
import Request from '../mediator/Data/request';
import ApiContex from './apiContex';
import { get } from "../general/static"

export default class ApiRequest<TValue> extends Request<TValue> {
    public apiId!: string;
    public apiContex!: ApiContex;

    constructor(contex?: ApiContex) {
        super();
        this.apiId = contex?.apiId ?? uuidv4();
        this.apiContex = contex ?? { ...get(ApiContex.name) };
        this.apiContex.contex = this.apiContex;
        this.apiContex.apiId = this.apiId;
    }
}