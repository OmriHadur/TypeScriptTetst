import * as fs from 'fs';

const encoding = 'utf8';

export function readFolder(folder: string, absFolder: string = folder) {
    const itemsNames = fs.readdirSync(folder) as string[];
    const items: any = {};
    itemsNames.forEach(itemName => {
        itemName = itemName.charAt(0).toLowerCase() + itemName.slice(1);
        const path = folder + "/" + itemName;
        if (itemName.endsWith('.json'))
            items[itemName.substring(0, itemName.length - 5)] = fileNameToObject(path);
        if (itemName.endsWith('.js'))
            items[itemName.substring(0, itemName.length - 3)] = require(absFolder + "/" + itemName);
        else if (!itemName.includes('.'))
            items[itemName] = readFolder(path, absFolder + "/" + itemName);
    });
    return items;
}

function fileNameToObject(path: string) {
    const file = fs.readFileSync(path, encoding);
    return JSON.parse(file);
}