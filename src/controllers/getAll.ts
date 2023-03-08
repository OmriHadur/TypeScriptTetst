
export default function (api: any) {
    return async (req: any, res: any, next: any) => {
        const entities = await api.module.find();
        const resourceMapping = entities.map(async (entity: any) => await api.mapEntityToResource(entity));
        const resources = await Promise.all(resourceMapping);
        res.status(200).json(resources);
    }
}