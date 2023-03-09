import Result from "../mediator/Data/result";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../messeges/createResourceRequest";

export default class CreateResourceHandler implements IRequestHandler<CreateResourceRequest, any>{
    messegeType = CreateResourceRequest.name;

    async handle(request: CreateResourceRequest, result: Result<any>): Promise<void> {
        const entityData = await request.api.mapCreateToEntity(request.resource);
        let entity = new request.api.module(entityData);
        entity = await entity.save();
        result.value = await request.api.mapEntityToResource(entity);
    }
}