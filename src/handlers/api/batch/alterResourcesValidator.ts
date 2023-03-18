import NotFoundError from "../../../Errors/notFoundError";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import { AlterOperation } from "../../../types/apiRelated";
import AlterResourcesRequest from "../../../messeges/api/batch/alterResourcesRequest";
import ApiDefinition from "../../../data/apiDefinition";

export default class AlterResourcesValidator
	implements IRequestHandler<AlterResourcesRequest, any>
{
	messegeType = AlterResourcesRequest.name;

	async validate?(request: AlterResourcesRequest): Promise<Error | void> {
		let allErrors = [];
		for (let validator of this.getValidators(request.operation, request.api)) {
			for (let i = 0; i < request.resources.length; i++) {
				const errors = await validator(request.resources[i]);
				for (let error of errors)
					error.propertyName = `[${i}].${error.propertyName}`
				if (errors.length > 0)
					allErrors.push(errors);
			}
		}
		allErrors = allErrors.reduce((acc: any[], cur: any) => acc.concat(cur), []);
		if (allErrors.length > 0)
			return new ValidationError(allErrors);

		if (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate) {
			for (let resource of request.resources) {
				const entity = await this.getExistEntity(request.api, resource);
				if (entity && request.operation == AlterOperation.Create)
					return new AlreadyExistError();
				if (entity)
					request.entities.push(entity);
			}
		} else {
			request.entities = await request.api.module.find({ _id: { $in: request.resourcesId } });
			if (request.entities.length != request.resourcesId?.length)
				return new NotFoundError(request.resourcesId!.toString());
		}
	}

	getExistEntity(api: ApiDefinition, resource: any) {
		const predicate: any = {};
		for (let [key] of Object.entries(api.types.create as any))
			predicate[key] = resource[key];
		return api.module.findOne(predicate);
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