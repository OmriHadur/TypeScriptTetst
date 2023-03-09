import ApiDefinition from "../data/apiDefinition";
import IMediator from "../mediator/interfaces/mediator";
import CreateResourceRequest from "../messeges/createResourceRequest";

export default function (api: ApiDefinition, mediator: IMediator) {
    return async (req: any, res: any, next: any) => {
        const result = await mediator.send(new CreateResourceRequest(api, req.body));
        if (result.isSuccess())
            res.status(201).json(result.value);
        else
            next(result.errors);
    }
}