import AlreadyExistError from "../../../Errors/alreadyExistError";
import ValidationError from "../../../Errors/validationError";
import { HandlingPriority } from "../../../mediator/handlingPriority";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../../../messeges/createResourceRequest";
import { getExistEntity } from "../../../helpers/getExistEntity";

export default class CreateResourceValidator implements IRequestHandler<CreateResourceRequest, any> {
	messegeType = CreateResourceRequest.name;
	priority = HandlingPriority.Validation;

	async handle(request: CreateResourceRequest, next: Function): Promise<any | Error> {
		const entity = await getExistEntity(request);
		if (entity)
			return new AlreadyExistError();
		const errors = await request.api.validateCreate(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
		return next();
	}
}
