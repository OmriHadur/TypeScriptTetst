
export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        await api.module.deleteMany();
        res.send();
    }
}