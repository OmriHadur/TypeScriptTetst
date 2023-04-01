import { v4 as uuidv4 } from 'uuid';
import ApiContex from '../../data/apiContex';

export default class Request<TValue> {
    public requestId: string;
    public apiContex!: ApiContex;

    constructor(requestId?: string) {
        this.requestId = requestId ?? uuidv4();
    }
}