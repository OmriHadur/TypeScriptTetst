import ApiDefinition from "../data/apiDefinition";
import IMediator from "../mediator/interfaces/mediator";
import GetAllResourcesRequest from "../messeges/getAllResourcesRequest";

export default function (api: ApiDefinition, mediator: IMediator) {
    return async (req: any, res: any, next: any) => {
        const result = await mediator.send(new GetAllResourcesRequest(api));
        if (result.isSuccess())
            res.status(200).json(result.value);
        else
            next(result.errors);
    }
}