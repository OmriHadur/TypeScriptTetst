
export async function hasEntity(module: any, prediction: any) {
    return await module.findOne(prediction);
}

export async function isNoEntity(module: any, prediction: any) {
    return !(await module.findOne(prediction));
}
