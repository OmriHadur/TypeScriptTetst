import ApiContex from "../../data/apiContex";
import getFunctions from "../../helpers/getFunctions";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetApiContexReqeust from "../../messeges/bootstrap/getApiContexReqeust";

export default class GetApiContexHandler
    implements IRequestHandler<GetApiContexReqeust, ApiContex>
{
    messegeType = GetApiContexReqeust.name;

    async handle(request: GetApiContexReqeust, result: Result<ApiContex>, mediator: IMediator): Promise<void> {
        const routes: any = {};
        for (let apiDefinition of request.serverDefinitions.apis)
            routes[apiDefinition.name] = apiDefinition.name;

        const functions = getFunctions(request.distFolder.functions);
        const validations = getFunctions(request.distFolder.validations);
        result.value = new ApiContex(routes, functions, validations, mediator);
        result.value = { ...result.value, ...routes, ...functions };
    }
}