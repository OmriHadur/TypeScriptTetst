import * as fs from 'fs';

export default async function (functionsFolder: string, functionsImportFolder: string): Promise<any> {
    const files = fs.readdirSync(functionsFolder);
    const functions: any = {};
    for (let fileName of files) {
        if (fileName.endsWith(".js")) {
            const functionFile = await import(functionsImportFolder + fileName);
            Object.entries(functionFile).forEach(([key, func]) => functions[key] = func);
        }
    };
    return functions;
}