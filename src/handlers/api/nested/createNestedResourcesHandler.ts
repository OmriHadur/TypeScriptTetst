
const { ObjectId } = require('mongodb');
import AlreadyExistError from "../../../Errors/alreadyExistError";
import Result from "../../../mediator/Data/result";
import IMediator from "../../../mediator/interfaces/mediator";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";
import GetExistingNestedEntityReqeust from "../../../messeges/api/nested/getExistingNestedEntityReqeust";

export default class CreateNestedResourceHandler implements IRequestHandler<CreateNestedResourceRequest, any> {
	messegeType = CreateNestedResourceRequest.name;

	async handle(request: CreateNestedResourceRequest, result: Result<any>, mediator: IMediator): Promise<void> {
		const parentEntity = request.parentEntity;
		const createNestedEntity = await request.nestedApi.mapCreateToEntity(request.resource);
		const nestedEntities: any[] = parentEntity[request.nestedApi.route];
		const getExistingNestedEntityReqeust = new GetExistingNestedEntityReqeust(nestedEntities, request.nestedApi, createNestedEntity);
		const nestedEntity: any = await mediator.sendValue(getExistingNestedEntityReqeust);
		if (nestedEntity._id)
			result.error = new AlreadyExistError();
		else {
			createNestedEntity._id = new ObjectId();
			nestedEntities.push(createNestedEntity);
			await parentEntity.save();
			result.value = await request.parentApi.mapEntityToResource(parentEntity);
		}
	}
}
