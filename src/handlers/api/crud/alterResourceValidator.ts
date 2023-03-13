import ValidationError from "../../../Errors/validationError";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";

export default class AlterResourceValidator
	implements IRequestHandler<AlterResourceRequest, any>
{
	messegeType = AlterResourceRequest.name;

	async validate?(request: AlterResourceRequest): Promise<Error | void> {
		const errors = request.isReplace
			? await request.api.validateReplace(request.resource)
			: await request.api.validateUpdate(request.resource);

		if (errors.length > 0)
			return new ValidationError(errors);
	}
}