import ValidationError from "../Errors/validationError";
import { HandlingPriority } from "../mediator/handlingPriority";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../messeges/alterResourceRequest";

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: AlterResourceRequest, next: Function
	): Promise<any | Error> {
		const errors = request.isReplace
			? await request.api.validateReplace(request.resource)
			: await request.api.validateUpdate(request.resource);

		if (errors.length > 0)
			return new ValidationError(errors);
		return next();
	}
}