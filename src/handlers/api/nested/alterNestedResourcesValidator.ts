import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import NotFoundError from "../../../Errors/notFoundError";
import { AlterOperation } from "../../../types/apiRelated";
import AlreadyExistError from "../../../Errors/alreadyExistError";

export default class AlterNestedResourcesValidator implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async validate?(request: AlterNestedResourceRequest): Promise<Error | void> {
		request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);

		let errors: any[] = [];
		for (let validator of this.getValidators(request.operation, request.nestedApi)) {
			const validatorErrors = await validator(request.user, request.resource);
			errors = errors.concat(validatorErrors);
		}

		if (errors.length > 0)
			return new ValidationError(errors);

		request.nestedEntities = request.parentEntity[request.nestedApi.name];
		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			request.entity = await this.getExistEntity(request);
			if (request.entity && request.operation == AlterOperation.Create)
				return new AlreadyExistError();
		} else {
			request.entity = request.nestedEntities!.find(e => e._id == request.resourceId);
			if (!request.entity)
				return new NotFoundError(request.requestId);
		}
	}

	getExistEntity(request: AlterNestedResourceRequest) {
		for (let nestedEntity of request.nestedEntities!) {
			let isEquals = true;
			for (let [key] of Object.entries(request.nestedApi.types.create))
				if (nestedEntity[key] != request.resource[key])
					isEquals = false;
			if (isEquals)
				return nestedEntity;
		}
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