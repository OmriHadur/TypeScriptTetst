import * as fs from 'fs';
import Dictionary from '../general/dictionary';

export default async function (handlersFolder: string, requireFolder: string): Promise<Dictionary<any[]>> {
    const messegesHandlers = new Dictionary<any[]>();
    await addFiles(messegesHandlers, handlersFolder, requireFolder);
    return messegesHandlers;
};

const addFiles = async (messegesHandlers: Dictionary<any[]>, filesFolder: string, requireFolder: string) => {
    const files = fs.readdirSync(filesFolder) as string[];
    for (let fileName of files) {
        if (fileName.endsWith(".js")) {
            const handlerInstance = await GetInstance(requireFolder, fileName);
            const messegeType = handlerInstance.messegeType ?? "*";
            messegesHandlers[messegeType] = messegesHandlers[messegeType] ?? [];
            messegesHandlers[messegeType].push(handlerInstance.handle);
        }
        else
            addFiles(messegesHandlers, filesFolder + fileName, requireFolder + fileName + "/");
    };

    async function GetInstance(requireFolder: string, fileName: string) {
        const handlerFile = await import(requireFolder + fileName);
        return new handlerFile.default();
    }
}