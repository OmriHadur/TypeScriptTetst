import ApiContex from "../../data/apiContex";
import Result from "../../mediator/Data/result";
import Unit from "../../mediator/Data/unit";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import AddValidationAndMappingRequest from "../../messeges/bootstrap/AddValidationAndMappingRequest";
import GetMappingDefinitionRequest from "../../messeges/bootstrap/getMappingDefinitionRequest";
import GetValidationDefinitionRequest from "../../messeges/bootstrap/getValidationDefinitionRequest";

export default class AddValidationAndMappingHandler
    implements IRequestHandler<AddValidationAndMappingRequest, Unit>
{
    messegeType = AddValidationAndMappingRequest.name;

    async handle(request: AddValidationAndMappingRequest, result: Result<Unit>, mediator: IMediator): Promise<void> {
        for (let resourceDefinition of request.serverDefinitions.apis) {
            const resourceConfig = request.serverConfig.apis[resourceDefinition.name].input;
            resourceDefinition.validation = await mediator.sendValue(new GetValidationDefinitionRequest(resourceDefinition, resourceConfig));
            resourceDefinition.mapping = await mediator.sendValue(new GetMappingDefinitionRequest(resourceDefinition, resourceConfig));
        }
    }
}