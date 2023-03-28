import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import NotFoundError from "../../../Errors/notFoundError";
import AlreadyExistError from "../../../Errors/alreadyExistError";
import ValidationError from "../../../Errors/validationError";
import ResourceDefinition from "../../../data/modules/resourceDefinition";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";

export default class CreateNestedResourcesValidator implements IRequestHandler<CreateNestedResourceRequest, any> {
	messegeType = CreateNestedResourceRequest.name;

	async validate?(request: CreateNestedResourceRequest): Promise<Error | void> {
		request.apiContex.input = request.resource;
		let errors = [];
		const validation = request.nestedApi.validation;

		errors = validation.create.validateInput(request.apiContex);
		errors = errors.concat(validation.alter.validateInput(request.apiContex));
		if (errors.length > 0)
			return new ValidationError(errors);

		request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);
		request.nestedEntities = request.parentEntity[request.nestedApi.name];

		await validation.create.calVariables(request.apiContex);
		errors = await validation.create.validateGeneral(request.apiContex);
		if (errors.length > 0)
			return new ValidationError(errors);

		request.entityData = await request.nestedApi.mapping.createToEntity(request.apiContex, request.resource);
		request.entity = this.getExistEntity(request.nestedEntities!, request.nestedApi, request.entityData);
		if (request.entity && request.onlyCreate)
			return new AlreadyExistError();
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