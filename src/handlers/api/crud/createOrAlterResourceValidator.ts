import ValidationError from "../../../Errors/validationError";
import { HandlingPriority } from "../../../mediator/handlingPriority";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import { getExistEntity } from "../../../helpers/getExistEntity";
import CreateOrAlterResourceRequest from "../../../messeges/api/crud/createOrAlterResourceRequest";

export default class CreateOrAlterResourceValidator implements IRequestHandler<CreateOrAlterResourceRequest, any> {
	messegeType = CreateOrAlterResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: CreateOrAlterResourceRequest, next: Function): Promise<any | Error> {
		request.entity = await getExistEntity(request);
		const validator = CreateOrAlterResourceValidator.getValidator(request);
		const errors = await validator(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
		return next();
	}

	static getValidator(request: CreateOrAlterResourceRequest) {
		if (request.entity == null)
			return request.api.validateCreate;
		return request.isReplace ?
			request.api.validateReplace :
			request.api.validateUpdate;
	}
}