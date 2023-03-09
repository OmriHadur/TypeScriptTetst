import ValidationError from "../Errors/validationError";
import Result from "../mediator/Data/result";
import { HandlingPriority } from "../mediator/handlingPriority";
import IMediator from "../mediator/interfaces/mediator";
import IRequestHandler from "../mediator/interfaces/requestHandler";
import CreateResourceRequest from "../messeges/createResourceRequest";

export default class CreateResourceValidator implements IRequestHandler<CreateResourceRequest, any>{
    messegeType = CreateResourceRequest.name;
    priority = HandlingPriority.Validation;

    async handle(request: CreateResourceRequest, result: Result<any>, next: Function): Promise<void> {
        const errors = await request.api.validateCreate(request.resource);
        if (errors.length > 0)
            result.errors.push(new ValidationError(errors));
        else
            await next();
    }
}