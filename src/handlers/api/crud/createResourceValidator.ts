import AlreadyExistError from "../../../Errors/alreadyExistError";
import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../../../messeges/api/crud/createResourceRequest";
import { getExistEntity } from "../../../helpers/getExistEntity";

export default class CreateResourceValidator implements IRequestHandler<CreateResourceRequest, any> {
	messegeType = CreateResourceRequest.name;

	async validate?(request: CreateResourceRequest): Promise<Error | void> {
		const entity = await getExistEntity(request);
		if (entity)
			return new AlreadyExistError();
		const errors = await request.api.validateCreate(request.resource);
		if (errors.length > 0)
			return new ValidationError(errors);
	}
}
