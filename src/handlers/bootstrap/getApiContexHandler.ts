import ApiContex from "../../data/apiContex";
import Database from "../../controllers/database";
import getFunctions from "../../helpers/getFunctions";
import Result from "../../mediator/Data/result";
import IMediator from "../../mediator/interfaces/mediator";
import IRequestHandler from "../../mediator/interfaces/requestHandler";
import GetApiContexReqeust from "../../messeges/bootstrap/getApiContexReqeust";

export default class GetApiContexHandler
    implements IRequestHandler<GetApiContexReqeust, ApiContex>
{
    messegeType = GetApiContexReqeust.name;

    async handle(request: GetApiContexReqeust, result: Result<ApiContex>, mediator: IMediator): Promise<void> {
        const db: any = {};
        for (let apiDefinition of request.serverDefinitions.apis)
            db[apiDefinition.name] = new Database(apiDefinition.name, mediator);

        const functions = getFunctions(request.distFolder.functions);
        const validations = getFunctions(request.distFolder.validations);
        result.value = new ApiContex(db, functions, validations, mediator);
        result.value = { contex: result.value, ...result.value, ...db, ...functions };
    }
}