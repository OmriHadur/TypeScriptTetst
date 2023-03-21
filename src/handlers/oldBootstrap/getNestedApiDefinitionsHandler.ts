import ApiDefinition from "../../data/modules/apiDefinition";
import Dictionary from "../../general/dictionary";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import Result from "../../mediator/Data/result";
import GetNestedApiDefinitionsReqeust from "../../messeges/oldBootstrap/getNestedApiDefinitionsReqeust";
import IMediator from "../../mediator/interfaces/mediator";
import GetApiDefinitionReqeust from "../../messeges/oldBootstrap/getApiDefinitionReqeust";
/*
export default class GetNestedApiDefinitionsHandler
    implements IRequestHandler<GetNestedApiDefinitionsReqeust, Dictionary<ApiDefinition[]>>
{
    messegeType = GetNestedApiDefinitionsReqeust.name;

    async handle(request: GetNestedApiDefinitionsReqeust, result: Result<Dictionary<ApiDefinition[]>>, mediator: IMediator): Promise<any> {
        const nested = new Dictionary<ApiDefinition[]>();

        for (let [apiRoute, jsonApiDefinition] of Object.entries(request.apiFolder)) {
            if (apiRoute.includes('.')) {
                const split = apiRoute.split('.');
                const apiRequest = new GetApiDefinitionReqeust(jsonApiDefinition, split[1], request.dataSchemes);
                const apiDefinition: ApiDefinition = await mediator.sendValue(apiRequest);
                const parent = split[0];
                nested[parent] = nested[parent] ?? [];
                nested[parent].push(apiDefinition);
            }
        };
        result.value = nested;
    }
}
*/