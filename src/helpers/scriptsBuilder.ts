import vm from "node:vm";

export function definitionToScript(definition: any, isTakeValue: boolean) {
	const scripts: any = {};

	Object.keys(definition).forEach((property) => {
		let script = definition[property];
		if (isTakeValue)
			script = script.value;
		if (isString(script))
			scripts[property] = stringToScript(script);
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

function isString(obj: any): obj is string {
	return typeof obj === "string";
}