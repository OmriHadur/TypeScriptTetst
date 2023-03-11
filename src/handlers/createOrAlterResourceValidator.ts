import ValidationError from "../Errors/validationError";
import { HandlingPriority } from "../mediator/handlingPriority";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import { getExistEntity } from "../helpers/getExistEntity";
import CreateOrAlterResourceRequest from "../messeges/createOrAlterResourceRequest";

export default class CreateOrAlterResourceValidator implements IRequestHandler<CreateOrAlterResourceRequest, any> {
	messegeType = CreateOrAlterResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: CreateOrAlterResourceRequest, next: Function): Promise<any | Error> {
		request.entity = await getExistEntity(request);
		const validator = this.getValidator(request);
		const errors = await validator(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
		return next();
	}

	getValidator = (request: CreateOrAlterResourceRequest) => {
		if (request.entity)
			return request.api.validateCreate;
		return request.isReplace ?
			request.api.validateReplace :
			request.api.validateUpdate;
	}
}