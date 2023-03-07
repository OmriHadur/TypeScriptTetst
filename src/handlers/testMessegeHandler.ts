import Result from "../mediator/Data/result";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import TestRequest from "../messeges/testMessege";

const wait = function (ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class TestMessegeHandler implements IRequestHandler<TestRequest, number>{
    messegeType = TestRequest.name;

    async handle(request: TestRequest, result: Result<number>, next: Function, mediator: IMediator): Promise<void> {
        await wait(200);
        if (request.number % 2 == 1)
            result.value = 2;
        else
            next();
    }
}