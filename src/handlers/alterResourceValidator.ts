import ValidationError from "../Errors/validationError";
import Result from "../mediator/Data/result";
import { HandlingPriority } from "../mediator/handlingPriority";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import AlterResourceRequest from "../messeges/alterResourceRequest";

export default class AlterResourceValidator implements IRequestHandler<AlterResourceRequest, any>{
    messegeType = AlterResourceRequest.name;
    priority = HandlingPriority.Validation;

    async handle(request: AlterResourceRequest, result: Result<any>, next: Function): Promise<void> {
        const errors = request.isReplace ?
            await request.api.validateReplace(request.resource) :
            await request.api.validateUpdate(request.resource);

        if (errors.length > 0)
            result.error = new ValidationError(errors);
        else
            await next();
    }
}