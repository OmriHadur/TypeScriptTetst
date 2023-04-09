import ResourceConfig from "../../data/input/resourceConfig";
import ResourceDefinition from "../../data/modules/resourceDefinition";
import ServerDefinitions from "../../data/modules/serverDefinitions";
import Result from "../../mediator/Data/result";
import Unit from "../../mediator/Data/unit";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import AddToDefinitionRequest from "../../messeges/bootstrap/addToDefinitionRequest";
import AddToDefinitionsRequest from "../../messeges/bootstrap/addToDefinitionsRequest";

export default class AddToDefinitionsHandler
    implements IRequestHandler<AddToDefinitionsRequest, Unit>
{
    messegeType = AddToDefinitionsRequest.name;

    async handle(request: AddToDefinitionsRequest, result: Result<Unit>, mediator: IMediator): Promise<void> {
        for (let resourceDefinition of request.serverDefinitions.datas) {
            const config = request.serverConfig.data[resourceDefinition.name];
            await this.addValidationAndMapping(resourceDefinition, config, mediator, request.serverDefinitions);
        }
        for (let resourceDefinition of request.serverDefinitions.apis) {
            const config = request.serverConfig.apis[resourceDefinition.name];
            for (let nestedDefinition of resourceDefinition.nested) {
                const nestedConfig = config.nested[nestedDefinition.name];
                await this.addValidationAndMapping(nestedDefinition, nestedConfig, mediator, request.serverDefinitions);
            }
            await this.addValidationAndMapping(resourceDefinition, config.input, mediator, request.serverDefinitions);
        }
    }

    async addValidationAndMapping(definition: ResourceDefinition, config: ResourceConfig, mediator: IMediator, serverDefinitions: ServerDefinitions) {
        const result = await mediator.send(new AddToDefinitionRequest(definition, config, serverDefinitions));
        if (result.isError())
            throw result.error;
    }
}