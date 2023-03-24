import ApiContex from "../../data/apiContex";
import getFunctions from "../../helpers/getFunctions";
import Result from "../../mediator/Data/result";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetApiContexReqeust from "../../messeges/bootstrap/getApiContexReqeust";

export default class GetApiContexHandler
    implements IRequestHandler<GetApiContexReqeust, ApiContex>
{
    messegeType = GetApiContexReqeust.name;

    async handle(request: GetApiContexReqeust, result: Result<ApiContex>): Promise<void> {
        const modules: any = {};
        for (let apiDefinition of request.apiDefinitions)
            modules[apiDefinition.name] = apiDefinition.database.module;

        const functions = getFunctions(request.distFolder.functions);
        const validations = getFunctions(request.distFolder.validations);
        result.value = new ApiContex(modules, functions, validations);
        result.value = { ...result.value, ...modules, ...functions };
    }
}