import IMediator from "./interfaces/mediator";
import { HandlingPriority } from "./handlingPriority";
import Dictionary from "../general/dictionary"

export default async function (messegesHandlers: Dictionary<any[]>) {
    const generalHandlers = messegesHandlers["*"];
    const messegesHandling: any = {};
    delete messegesHandlers["*"];

    for (let messegeType in messegesHandlers) {
        let handlers = messegesHandlers[messegeType];
        handlers = handlers.concat(generalHandlers);
        handlers = handlers.sort(handler => handler.priority ?? HandlingPriority.Handeling);

        messegesHandling[messegeType] = (messege: any, result: any, mediator: IMediator) =>
            handlers.reduce((prevFunc, nextFunc) =>
                () => nextFunc(messege, result, prevFunc, mediator), undefined);
    }
    return messegesHandling;
};
