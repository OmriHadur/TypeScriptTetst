import vm from 'node:vm';

export function definitionToScript(definition: any) {
    const scripts: any = {};
    Object.keys(definition).forEach(property => {
        const script = definition[property];
        scripts[property] = stringToScript(script);
    });
    return scripts;
};

export function stringToScript(scriptAsString: string) {
    if (scriptAsString.includes('await'))
        scriptAsString = "async function run(){return " + scriptAsString + ";} run();"
    return new vm.Script(scriptAsString);
}

export function runScript(script: any, context: any) {
    vm.createContext(context);
    return script.runInContext(context);
}