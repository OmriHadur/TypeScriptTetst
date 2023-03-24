import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import NotFoundError from "../../../Errors/notFoundError";
import { AlterOperation } from "../../../types/apiRelated";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import validateInput from "../common/validateInput";

export default class AlterNestedResourcesValidator implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async validate?(request: AlterNestedResourceRequest): Promise<Error | void> {
		request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);

		const error = await validateInput(request.apiContex!, request.nestedApi, request.operation, request.resource);
		if (error)
			return error;

		request.nestedEntities = request.parentEntity[request.nestedApi.name];
		const entityData = await request.nestedApi.mapping.createToEntity(request.apiContex, request.resource);
		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			request.entity = await this.getExistEntity(request, entityData);
			if (request.entity && request.operation == AlterOperation.Create)
				return new AlreadyExistError();
		} else {
			request.entity = request.nestedEntities!.find(e => e._id == request.resourceId);
			if (!request.entity)
				return new NotFoundError(request.requestId);
		}
	}

	getExistEntity(request: AlterNestedResourceRequest, entityData: any) {
		for (let nestedEntity of request.nestedEntities!) {
			let isEquals = true;
			for (let property of request.nestedApi.properties.unique)
				if (nestedEntity[property] != entityData[property])
					isEquals = false;
			if (isEquals)
				return nestedEntity;
		}
	}
}