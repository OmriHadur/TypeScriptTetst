
export async function getExistEntity(request: { api: any, resource: any }) {
	const predicate: any = {};
	for (let [key] of Object.entries(request.api.types.create as any))
		predicate[key] = request.resource[key];
	return await request.api.module.findOne(predicate);
}
