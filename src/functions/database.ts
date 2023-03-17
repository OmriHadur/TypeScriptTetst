
export async function getEntity(module: any, prediction: any) {
	return await module.findOne(prediction);
}