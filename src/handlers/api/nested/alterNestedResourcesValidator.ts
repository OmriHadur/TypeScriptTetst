import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import NotFoundError from "../../../errors/notFoundError";
import ValidationError from "../../../errors/validationError";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";
import { AlterOperation } from "../../../types/apiRelated";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import AlreadyExistError from "../../../errors/alreadyExistError";

export default class AlterNestedResourceValidator implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async validate?(request: AlterNestedResourceRequest): Promise<Error | void> {
		const validation = request.nestedApi.validation;
		request.apiContex.input = request.resource;
		let errors = {};

		const isCreate = (request.operation == AlterOperation.Create || request.operation == AlterOperation.ReplaceOrCreate);

		if (isCreate)
			errors = validation.create.validateInput(request.apiContex);
		const alterErorrs = validation.alter.validateInput(request.apiContex, request.operation != AlterOperation.Update);
		errors = { ...errors, ...alterErorrs };
		if (Object.keys(errors).length > 0)
			return new ValidationError(errors);

		request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);
		request.nestedEntities = request.parentEntity[request.nestedApi.name];

		if (isCreate) {
			errors = await validation.create.validateGeneral(request.apiContex);
			if (Object.keys(errors).length > 0)
				return new ValidationError(errors);

			request.entityData = await request.nestedApi.mapping.createToEntity(request.apiContex, request.resource);
			request.entity = this.getExistEntity(request.nestedEntities!, request.nestedApi, request.entityData);
			if (request.entity && request.operation == AlterOperation.Create)
				return new AlreadyExistError();
		} else {
			request.entity = request.nestedEntities!.find(e => e._id == request.resourceId);
			if (!request.entity)
				return new NotFoundError(request.resourceId!);
		}
		request.apiContex.entity = request.entity ?? request.entityData;

		errors = await validation.alter.validateGeneral(request.apiContex);
		if (Object.keys(errors).length > 0)
			return new ValidationError(errors);
	}

	getExistEntity(nestedEntities: any[], api: ResourceDefinition, entityData: any) {
		for (let nestedEntity of nestedEntities) {
			let isEquals = true;
			for (let property of api.properties.unique)
				if (nestedEntity[property] != entityData[property])
					isEquals = false;
			if (isEquals)
				return nestedEntity;
		}
	}
}