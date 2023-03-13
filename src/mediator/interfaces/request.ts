import { v4 as uuidv4 } from 'uuid';

export default class Request<TValue> {
    public id: string;

    constructor() {
        this.id = uuidv4();
    }
}