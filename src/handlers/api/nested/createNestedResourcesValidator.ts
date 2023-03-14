import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateNestedResourceRequest from "../../../messeges/api/nested/createNestedResourceRequest";
import NotFoundError from "../../../Errors/notFoundError";

export default class CreateOrAlterResourceValidator implements IRequestHandler<CreateNestedResourceRequest, any> {
	messegeType = CreateNestedResourceRequest.name;

	async validate?(request: CreateNestedResourceRequest): Promise<Error | void> {
		request.parentEntity = await request.parentApi.module.findById(request.parentId);
		if (!request.parentEntity)
			return new NotFoundError(request.parentId);

		const validator = request.nestedApi.validateCreate
		const errors = await validator(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
	}
}