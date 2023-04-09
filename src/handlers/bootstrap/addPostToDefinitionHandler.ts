import IRequestHandler from "../../mediator/interfaces/requestHandler";
import AddToDefinitionRequest from "../../messeges/bootstrap/addToDefinitionRequest";
import Unit from "../../mediator/Data/unit";
import ApiContex from "../../data/apiContex";
import Dictionary from "../../general/dictionary";
import * as scriptsBuilder from '../../helpers/scriptsBuilder';

export default class AddPostToDefinitionHandler
    implements IRequestHandler<AddToDefinitionRequest, Unit>
{
    messegeType = AddToDefinitionRequest.name;

    async handle(request: AddToDefinitionRequest): Promise<void> {
        request.resourceDefinition.postCreate = this.getFunction(request.resourceConfig.create.post);
        request.resourceDefinition.postAlter = this.getFunction(request.resourceConfig.alter.post);
    }

    getFunction(config: Dictionary<string>) {
        if (config && Object.keys(config).length > 0) {
            const scripts: any[] = [];
            for (let [, script] of Object.entries(config))
                scripts.push(scriptsBuilder.stringToScript(script));
            return async (contex: ApiContex) => {
                for (let script of scripts)
                    await scriptsBuilder.runScript(script, contex);
            }
        }
    }
}
