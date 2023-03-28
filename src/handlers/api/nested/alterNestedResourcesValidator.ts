import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import NotFoundError from "../../../Errors/notFoundError";
import ValidationError from "../../../Errors/validationError";
import AlterNestedResourceRequest from "../../../messeges/api/nested/alterNestedResourceRequest";

export default class AlterNestedResourceValidator implements IRequestHandler<AlterNestedResourceRequest, any> {
	messegeType = AlterNestedResourceRequest.name;

	async validate?(request: AlterNestedResourceRequest): Promise<Error | void> {
		request.apiContex.input = request.resource;
		let errors = [];
		const validation = request.nestedApi.validation;

		request.apiContex.isValidateUndefined = request.isOnlyUpdate;
		errors = validation.alter.validateInput(request.apiContex);
		if (errors.length > 0)
			return new ValidationError(errors);

		if (!request.parentEntity) {
			request.parentEntity = await request.parentApi.database.module.findById(request.parentId);
			if (!request.parentEntity)
				return new NotFoundError(request.parentId);
		}
		if (!request.nestedEntities)
			request.nestedEntities = request.parentEntity[request.nestedApi.name];

		if (!request.entity)
			request.entity = request.nestedEntities!.find(e => e._id == request.resourceId);
		request.apiContex.entity = request.entity;

		await validation.alter.calVariables(request.apiContex);
		errors = await validation.alter.validateGeneral(request.apiContex);
		if (errors.length > 0)
			return new ValidationError(errors);

		if (!request.entity)
			return new NotFoundError(request.requestId);
	}
}