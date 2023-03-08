import NotFoundError from "../Errors/notFoundError";

export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        const id = req.params.id;
        const entity = await api.module.findById(id)
        if (entity) {
            const resource = await api.mapEntityToResource(entity);
            res.status(200).json(resource);
        }
        else
            next(new NotFoundError(req.params.id));
    }
}