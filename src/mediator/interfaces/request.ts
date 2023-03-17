import { v4 as uuidv4 } from 'uuid';

export default class Request<TValue> {
    public requestId: string;

    constructor() {
        this.requestId = uuidv4();
    }
}