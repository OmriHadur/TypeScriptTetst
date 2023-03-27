import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import NotFoundError from "../../../Errors/notFoundError";
import { AlterOperation } from "../../../types/apiRelated";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import * as validationHelper from "../common/validationHelper"
import ValidationError from "../../../Errors/validationError";
import Result from "../../../mediator/Data/result";

export default class AlterNestedResourcesValidator implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async validate?(request: AlterNestedResourceRequest): Promise<Error | void> {

		request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);
		request.apiContex!.input = request.resource;

		let errors = validationHelper.getInputErrors(request.apiContex, request.operation, request.nestedApi.validation);
		if (errors.length > 0)
			return new ValidationError(errors);

		await validationHelper.calVariables(request.apiContex, request.operation, request.nestedApi.validation);
		let result = await this.getEntity(request);
		if (result.isError())
			return result.error;
		const entity = result.value;
		request.entity = entity;
		request.apiContex!.entity = entity;

		errors = await validationHelper.getGeneralValidation(request.apiContex, request.operation, request.nestedApi.validation);
		if (errors.length > 0)
			return new ValidationError(errors);
	}

	async getEntity(request: AlterNestedResourceRequest): Promise<Result<any>> {
		const result = new Result();
		request.nestedEntities = request.parentEntity[request.nestedApi.name];
		const entityData = await request.nestedApi.mapping.createToEntity(request.apiContex, request.resource);
		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			result.value = await this.getExistEntity(request, entityData);
			if (result.value && request.operation == AlterOperation.Create)
				result.error = new AlreadyExistError();
		} else {
			result.value = request.nestedEntities!.find(e => e._id == request.resourceId);
			if (!result.value)
				result.error = new NotFoundError(request.requestId);
		}
		return result;
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