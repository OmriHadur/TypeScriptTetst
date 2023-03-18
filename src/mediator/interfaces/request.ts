import { v4 as uuidv4 } from 'uuid';

export default class Request<TValue> {
    public requestId: string;
    public user?: any;
    
    constructor() {
        this.requestId = uuidv4();
    }
}