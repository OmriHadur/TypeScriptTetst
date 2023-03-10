
export async function isNoEntity(module: any, prediction: any) {
	return (await getEntity(module, prediction) == null);
}

export async function getEntity(module: any, prediction: any) {
	return await module.findOne(prediction);
}