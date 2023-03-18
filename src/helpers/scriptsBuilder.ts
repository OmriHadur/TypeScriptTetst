import vm from "node:vm";
import Dictionary from "../general/dictionary";

const variables = 'variables';

export function definitionToScript(definition: any) {
	const scripts: any = { variables: {}, properties: {} };

	Object.keys(definition).forEach((property) => {
		const value = definition[property];
		if (property == variables) {
			for (let [variableName, variableScript] of Object.entries(value as Dictionary<string>))
				scripts.variables[variableName] = stringToScript(variableScript);
		} else
			scripts.properties[property] = stringToScript(value);
	});
	return scripts;
}

export function stringToScript(scriptAsString: string) {
	if (scriptAsString.includes("await"))
		scriptAsString = "async function run(){return " + scriptAsString + ";} run();";
	return new vm.Script(scriptAsString);
}

export function runScript(script: any, context: any) {
	vm.createContext(context);
	return script.runInContext(context);
}
