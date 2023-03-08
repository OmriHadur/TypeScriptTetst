import ValidationError from "../Errors/validationError";

export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        const errors = await api.validateCreate(req.body);
        if (errors.length > 0)
            next(new ValidationError(errors));
        else {
            const entityData = await api.mapCreateToEntity(req.body);
            let entity = new api.module(entityData);
            entity = await entity.save();
            const resource = await api.mapEntityToResource(entity);
            res.status(201).json(resource);
        }
    }
}