
export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        api.module.deleteMany()
            .then(() => res.send())
            .catch((err: any) => next(err));
    }
}