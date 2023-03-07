import Result from "../mediator/Data/result";
import { HandlingPriority } from "../mediator/handlingPriority";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import TestRequest from "../messeges/testMessege";

export default class TestMessegeHandler implements IRequestHandler<TestRequest, number>{
    messegeType = TestRequest.name;
    priority = HandlingPriority.Validation;

    async handle(request: TestRequest, result: Result<number>, next: Function, mediator: IMediator): Promise<void> {
        if (request.number <= 0)
            result.errors.push(new Error("number is negitive"));
        if (!request.name)
            result.errors.push(new Error("name missing"));
        if (!result.isFailed())
            await next();
    }
}