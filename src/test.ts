import Mediator from "./mediator/mediator";
import TestRequest from "./messeges/testMessege";
import Result from "./mediator/Data/result";
import getMessegesHandling from "./mediator/getMessegesHandling";
import getMessegesHandlers from "./mediator/getMessegesHandlers";
import TestUnitMessege from "./messeges/testUnitMessege";
import Unit from "./mediator/Data/unit";
const filesFolder = './dist/handlers';
const requireFolder = '../handlers/';

const a = async () => {
    const messegesHandlers = await getMessegesHandlers(filesFolder, requireFolder);
    const handlers = await getMessegesHandling(messegesHandlers);
    const messege = new TestRequest("name", 1);
    const mediator = new Mediator(handlers);
    const result = await mediator.send(messege) as Result<number>;
    const result2 = await mediator.send(new TestUnitMessege) as Result<Unit>;
    console.log(result.isSuccess());
    console.log(result2.isSuccess());
};
a();
