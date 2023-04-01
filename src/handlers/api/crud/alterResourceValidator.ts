import NotFoundError from "../../../errors/notFoundError";
import AlreadyExistError from "../../../errors/alreadyExistError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";
import ValidationError from "../../../errors/validationError";
import ApiDefinition from "../../../data/modules/apiDefinition";

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;

	async validate?(request: AlterResourceRequest): Promise<Error | void> {
		const validation = request.api.validation;
		request.apiContex.input = request.resource;
		let errors = {};

		const isCreate = (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate);

		if (isCreate)
			errors = validation.create.validateInput(request.apiContex, true);

		const alterErorrs = validation.alter.validateInput(request.apiContex, request.operation != AlterOperation.Update);
		errors = { ...errors, ...alterErorrs };
		if (Object.keys(errors).length > 0)
			return new ValidationError(errors);

		if (isCreate) {
			errors = await validation.create.validateGeneral(request.apiContex);
			if (Object.keys(errors).length > 0)
				return new ValidationError(errors);

			request.entityData = await request.api.mapping.createToEntity(request.apiContex, request.resource);
			request.entity = await this.getExistEntity(request.api, request.entityData);
			if (request.entity && request.operation == AlterOperation.Create)
				return new AlreadyExistError();
		} else {
			request.entity = await request.api.database.module.findById(request.resourceId);
			if (!request.entity)
				return new NotFoundError(request.resourceId!);
		}
		request.apiContex.entity = request.entity;

		errors = await validation.alter?.validateGeneral(request.apiContex);
		if (Object.keys(errors).length > 0)
			return new ValidationError(errors);
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