import ValidationError from "../Errors/validationError";
import { HandlingPriority } from "../mediator/handlingPriority";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import { getExistEntity } from "../helpers/getExistEntity";
import CreateOrReplaceResourceRequest from "../messeges/createOrReplaceResourceRequest";

export default class CreateOrReplaceResourceValidator implements IRequestHandler<CreateOrReplaceResourceRequest, any> {
	messegeType = CreateOrReplaceResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: CreateOrReplaceResourceRequest, next: Function): Promise<any | Error> {
		request.entity = await getExistEntity(request);
		const validator = request.entity ? request.api.validateCreate : request.api.validateReplace;
		const errors = await validator(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
		return next();
	}
}
