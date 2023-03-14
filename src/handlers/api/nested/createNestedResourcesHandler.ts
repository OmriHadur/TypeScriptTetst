
const { ObjectId } = require('mongodb');
import ApiDefinition from "../../../data/apiDefinition";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";

export default class CreateNestedResourceHandler implements IRequestHandler<CreateNestedResourceRequest, any> {
	messegeType = CreateNestedResourceRequest.name;

	async handle(request: CreateNestedResourceRequest, result: Result<any>): Promise<void> {
		const parentEntity = request.parentEntity;
		const createNestedEntity = await request.nestedApi.mapCreateToEntity(request.resource);
		const nestedEntities: any[] = parentEntity[request.nestedApi.route];
		const nestedEntity = this.getNestedEntity(nestedEntities, request.nestedApi, createNestedEntity);
		if (nestedEntity)
			result.error = new AlreadyExistError();
		else {
			createNestedEntity._id = new ObjectId();
			nestedEntities.push(createNestedEntity);
			await parentEntity.save();
			result.value = await request.parentApi.mapEntityToResource(parentEntity);
		}
	}

	public getNestedEntity(nestedEntities: any[], nestedApi: ApiDefinition, createNestedEntity: any): any {
		for (let nestedEntity of nestedEntities) {
			let isEquals = true;
			for (let [key] of Object.entries(nestedApi.types.create!))
				if (nestedEntity[key] != createNestedEntity[key])
					isEquals = false;
			if (isEquals)
				return nestedEntity;
		}
	}
}
