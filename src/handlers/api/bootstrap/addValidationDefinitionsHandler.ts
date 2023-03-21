import ApiContex from "../../../data/apiContex";
import Result from "../../../mediator/Data/result";
import Unit from "../../../mediator/Data/unit";
import IMediator from "../../../mediator/interfaces/mediator";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AddValidationDefinitionsRequest from "../../../messeges/bootstrap/addValidationDefinitionsRequest";
import GetValidationDefinitionRequest from "../../../messeges/bootstrap/getValidationDefinitionRequest";

export default class AddValidationDefinitionsHandler
    implements IRequestHandler<AddValidationDefinitionsRequest, ApiContex>
{
    messegeType = AddValidationDefinitionsRequest.name;

    async handle(request: AddValidationDefinitionsRequest, result: Result<Unit>, mediator: IMediator): Promise<void> {
        for (let resourceDefinition of request.serverDefinitions.apis) {
            const resourceConfig = request.serverConfig.apis[resourceDefinition.name].input;
            resourceDefinition.validation = await mediator.sendValue(new GetValidationDefinitionRequest(resourceDefinition, resourceConfig, request.apiContex));
        }
    }
}