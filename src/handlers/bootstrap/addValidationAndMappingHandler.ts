import ResourceConfig from "../../data/input/resourceConfig";
import ResourceDefinition from "../../data/modules/resourceDefinition";
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
            const config = request.serverConfig.apis[resourceDefinition.name];
            for (let nestedDefinition of resourceDefinition.nested) {
                const nestedConfig = config.nested[nestedDefinition.name];
                await this.addValidationAndMapping(nestedDefinition, nestedConfig, mediator);
            }
            await this.addValidationAndMapping(resourceDefinition, config.input, mediator);
        }
    }

    async addValidationAndMapping(definition: ResourceDefinition, config: ResourceConfig, mediator: IMediator) {
        definition.validation = await mediator.sendValue(new GetValidationDefinitionRequest(definition, config));
        definition.mapping = await mediator.sendValue(new GetMappingDefinitionRequest(definition, config));
    }
}