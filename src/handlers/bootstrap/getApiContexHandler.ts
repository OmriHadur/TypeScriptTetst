import ApiContex from "../../data/apiContex";
import Dictionary from "../../general/dictionary";
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
            modules[apiDefinition.route!] = apiDefinition.module;

        const functions: any = {};
        this.addFunctions(request.functionsFolder, functions);

        result.value = new ApiContex(modules, functions);
    }

    private addFunctions(functionsFolder: Dictionary<any>, functions: Dictionary<Function>) {
        Object.entries(functionsFolder).forEach(
            ([key, value]) => {
                if (typeof value === 'function')
                    functions[key] = value;
                else
                    this.addFunctions(value, functions);
            }
        );
    }

}