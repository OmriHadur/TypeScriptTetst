import ApiDefinition from "../../data/apiDefinition";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetApiDefinitionsReqeust from "../../messeges/bootstrap/getApiDefinitionsReqeust";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import GetApiDefinitionReqeust from "../../messeges/bootstrap/getApiDefinitionReqeust";
export default class GetApiDefinitionsHandler
    implements IRequestHandler<GetApiDefinitionsReqeust, ApiDefinition[]>
{
    messegeType = GetApiDefinitionsReqeust.name;

    async handle(request: GetApiDefinitionsReqeust, result: Result<ApiDefinition[]>, mediator: IMediator): Promise<any> {
        const apiJDefinitions: ApiDefinition[] = [];
        for (let [apiRoute, jsonApiDefinition] of Object.entries(request.apiFolder)) {
            if (!apiRoute.includes('.')) {
                const apiRequest = new GetApiDefinitionReqeust(jsonApiDefinition, apiRoute, request.dataSchemes);
                const apiDefinition: ApiDefinition = await mediator.sendValue(apiRequest);
                apiDefinition.nestedApis = request.nested[apiDefinition.route] ?? [];
                apiJDefinitions.push(apiDefinition);
            }
        };
        result.value = apiJDefinitions;
    }
}