import NotFoundError from "../Errors/notFoundError";

export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        const id = req.params.id;
        const found = await api.module.findByIdAndDelete(id);
        if (!found)
            next(new NotFoundError(req.params.id));
        else
            res.send();
    }
}