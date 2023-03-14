export default function (folder: any) {
    const functions: any = {};
    addFunctions(folder, functions);
    return functions;
}

const addFunctions = (functionFolder: any, functions: any) => {
    Object.entries(functionFolder).forEach(([key, value]) => {
        if (typeof value === 'function')
            functions[key] = value;
        else
            addFunctions(value, functions);
    });
}
