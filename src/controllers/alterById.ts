import ValidationError from "../Errors/validationError";

export default function (api: any, isOverried: boolean) {
    return async (req: any, res: any, next: any) => {
        const errors = isOverried ?
            await api.validateReplace(req.body) :
            await api.validateUpdate(req.body);

        if (errors.length > 0)
            next(new ValidationError(errors));
        else {
            const id = req.params.id;
            let entity = await api.module.findById(id)
            const entityRepalce = await api.mapAlterToEntity(req.body);
            Object.entries(entityRepalce).forEach(([key, value]) => {
                if (value || isOverried)
                    entity[key] = value;
            });
            entity = await entity.save();
            const resource = await api.mapEntityToResource(entity);
            res.status(200).json(resource);
        }
    }
}