import NotFoundError from "../../../Errors/notFoundError";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;

	async validate?(request: AlterResourceRequest): Promise<Error | void> {
		let errors: any[] = [];
		for (let validator of this.getValidators(request.operation, request.api))
			errors = errors.concat(await validator(request.user, request.resource));

		if (errors.length > 0)
			return new ValidationError(errors);

		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			const entityData = await request.api.mapCreateToEntity(request.user, request.resource);
			request.entity = await this.getExistEntity(request, entityData);
			if (request.entity && request.operation == AlterOperation.Create)
				return new AlreadyExistError();
		} else {
			request.entity = await request.api.module.findById(request.resourceId);
			if (!request.entity)
				return new NotFoundError(request.resourceId!);
		}
	}

	getExistEntity(request: AlterResourceRequest, entityData: any) {
		const predicate: any = {};
		for (let key of request.api.types.unique!)
			predicate[key] = entityData[key];
		if (Object.keys(predicate).length == 0)
			return null;
		return request.api.module.findOne(predicate);
	}

	getValidators = function* getValidators(operation: AlterOperation, api: any) {
		switch (operation) {
			case AlterOperation.Create:
			case AlterOperation.ReplaceOrCreate:
				yield api.validateCreate;
				yield api.validateReplace;
				break;
			case AlterOperation.Replace:
				yield api.validateReplace;
			case AlterOperation.Update:
				yield api.validateUpdate;
		}
	}
}