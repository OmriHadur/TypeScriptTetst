import Result from "../mediator/Data/result";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../messeges/alterResourceRequest";

export default class AlterResourceHandler implements IRequestHandler<AlterResourceRequest, any>{
    messegeType = AlterResourceRequest.name;

    async handle(request: AlterResourceRequest, result: Result<any>): Promise<void> {
        let entity = await request.api.module.findById(request.id)
        const entityRepalce = await request.api.mapAlterToEntity(request.resource);
        Object.entries(entityRepalce).forEach(([key, value]) => {
            if (value || request.isReplace)
                entity[key] = value;
        });
        entity = await entity.save();
        result.value = await request.api.mapEntityToResource(entity);
    }
}