import NotFoundError from "../../../Errors/notFoundError";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";
import Result from "../../../mediator/Data/result";
import ValidationError from "../../../Errors/validationError";
import * as validationHelper from "../common/validationHelper"

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;

	async validate?(request: AlterResourceRequest): Promise<Error | void> {
		request.apiContex!.input = request.resource;

		let errors = validationHelper.getInputErrors(request.apiContex, request.operation, request.api.validation);
		if (errors.length > 0)
			return new ValidationError(errors);

		await validationHelper.calVariables(request.apiContex, request.operation, request.api.validation);
		let result = await this.getEntity(request);
		if (result.isError())
			return result.error;
		const entity = result.value;
		request.entity = entity;
		request.apiContex!.entity = entity;

		errors = await validationHelper.getGeneralValidation(request.apiContex, request.operation, request.api.validation);
		if (errors.length > 0)
			return new ValidationError(errors);
	}

	private async getEntity(request: AlterResourceRequest): Promise<Result<any>> {
		const result = new Result();
		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			const entityData = await request.api.mapping.createToEntity(request.apiContex, request.resource);
			result.value = await this.getExistEntity(request, entityData);
			if (result.value && request.operation == AlterOperation.Create)
				result.error = new AlreadyExistError();
		} else {
			result.value = await request.api.database.module.findById(request.resourceId);
			if (!request.entity)
				result.error = new NotFoundError(request.resourceId!);
		}
		return result;
	}


	getExistEntity(request: AlterResourceRequest, entityData: any) {
		const predicate: any = {};
		for (let key of request.api.properties.unique)
			predicate[key] = entityData[key];
		if (Object.keys(predicate).length == 0)
			return null;
		return request.api.database.module.findOne(predicate);
	}
}