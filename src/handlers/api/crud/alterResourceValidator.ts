import NotFoundError from "../../../Errors/notFoundError";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";
import ValidationError from "../../../Errors/validationError";
import ApiDefinition from "../../../data/modules/apiDefinition";
import Result from "../../../mediator/Data/result";

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;

	async validate?(request: AlterResourceRequest): Promise<Error | void> {
		const contex = request.apiContex;
		contex.input = request.resource;
		let errors = [];
		const validation = request.api.validation;

		if (request.operation == AlterOperation.Create)
			errors = request.api.validation.create.validateInput(contex);
		errors = errors.concat(request.api.validation.alter.validateInput(contex));
		if (errors.length > 0)
			return new ValidationError(errors);

		const entityResult = await this.getEntityResult(request);
		if (entityResult.isError())
			return entityResult.error;
		else
			contex.entity = entityResult.value;

		request.apiContex.isValidateUndefined = request.operation == AlterOperation.Update;
		await validation.alter.calVariables(contex);
		errors = await validation.alter.validateGeneral(contex);
		if (errors.length > 0)
			return new ValidationError(errors);
	}

	async getEntityResult(request: AlterResourceRequest) {
		const result = new Result();
		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			request.api.validation.create.calVariables(request.apiContex);
			let errors = await request.api.validation.create.validateGeneral(request.apiContex);
			if (errors.length > 0)
				result.error = new ValidationError(errors);
			else {
				let entity = await request.api.mapping.createToEntity(request.apiContex, request.resource);
				entity = await this.getExistEntity(request.api, entity);
				if (request.operation == AlterOperation.Create) {
					if (entity)
						result.error = new AlreadyExistError();
				} else
					result.value = entity;
			}
		} else {
			result.value = await request.api.database.module.findById(request.resourceId);
			if (!result.value)
				result.error = new NotFoundError(request.resourceId!);
		}
		return result;
	}

	getExistEntity(api: ApiDefinition, entityData: any) {
		const predicate: any = {};
		for (let key of api.properties.unique)
			predicate[key] = entityData[key];
		if (Object.keys(predicate).length == 0)
			return null;
		return api.database.module.findOne(predicate);
	}
}