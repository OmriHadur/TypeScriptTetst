import ResourceConfig from "../../data/input/resourceConfig";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";
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
        for (let resourceDefinition of request.serverDefinitions.datas) {
            const config = request.serverConfig.data[resourceDefinition.name];
            await this.addValidationAndMapping(resourceDefinition, config, mediator,request.serverDefinitions);
        }
        for (let resourceDefinition of request.serverDefinitions.apis) {
            const config = request.serverConfig.apis[resourceDefinition.name];
            for (let nestedDefinition of resourceDefinition.nested) {
                const nestedConfig = config.nested[nestedDefinition.name];
                await this.addValidationAndMapping(nestedDefinition, nestedConfig, mediator,request.serverDefinitions);
            }
            await this.addValidationAndMapping(resourceDefinition, config.input, mediator, request.serverDefinitions);
        }
    }

    async addValidationAndMapping(definition: ResourceDefinition, config: ResourceConfig, mediator: IMediator, serverDefinitions: ServerDefinitions) {
        definition.validation = await mediator.sendValue(new GetValidationDefinitionRequest(definition, config, serverDefinitions));
        definition.mapping = await mediator.sendValue(new GetMappingDefinitionRequest(definition, config));
    }
}