import ValidationError from "../Errors/validationError";
import { HandlingPriority } from "../mediator/handlingPriority";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../messeges/createResourceRequest";

export default class CreateResourceValidator implements IRequestHandler<CreateResourceRequest, any> {
	messegeType = CreateResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: CreateResourceRequest, next: Function): Promise<any | Error> {
		const errors = await request.api.validateCreate(request.resource);
		if (errors.length > 0) return new ValidationError(errors);
		return next();
	}
}
