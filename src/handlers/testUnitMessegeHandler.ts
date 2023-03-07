import Result from "../mediator/Data/result";
import Unit from "../mediator/Data/unit";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import TestUnitMessege from "../messeges/testUnitMessege";


export default class TestMessegeHandler implements IRequestHandler<TestUnitMessege, Unit>{
    messegeType = TestUnitMessege.name;

    async handle(request: TestUnitMessege, result: Result<Unit>, next: Function, mediator: IMediator): Promise<void> {
        result.value = Unit.Instance;
    }
}