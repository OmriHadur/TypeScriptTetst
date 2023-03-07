import IRequest from "../mediator/interfaces/request";

export default class TestRequest implements IRequest<number> {
    name: string;
    number: number;

    constructor(name: string, number: number) {
        this.name = name;
        this.number = number;
    }
}