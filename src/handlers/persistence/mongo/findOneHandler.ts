import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import { get } from "../../../general/static";
import ServerDefinitions from "../../../data/modules/serverDefinitions";
import FindOneRequest from "../../../messeges/persistence/findOneRequest";

const definitions = () => get(ServerDefinitions.name) as ServerDefinitions;

export default class FindOneHandler
    implements IRequestHandler<FindOneRequest, any>
{
    messegeType = FindOneRequest.name;

    async handle(request: FindOneRequest, result: Result<any>) {
        const module = definitions().apisDic[request.route].database.module;
        result.value = await module.findOne(request.predicate);
    }
}
