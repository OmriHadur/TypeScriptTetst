import Result from "../mediator/Data/result";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import GetAllResourcesRequest from "../messeges/getAllResourcesRequest";

export default class CreateResourceHandler implements IRequestHandler<GetAllResourcesRequest, any[]>{
    messegeType = GetAllResourcesRequest.name;

    async handle(request: GetAllResourcesRequest, result: Result<any[]>): Promise<void> {
        const entities = await request.api.module.find();
        result.value = await request.api.mapEntitiesToResources(entities);
    }
}