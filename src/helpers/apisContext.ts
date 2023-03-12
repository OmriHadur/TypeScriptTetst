import ApiDefinition from "../data/apiDefinition";
import Dictionary from "../general/dictionary";

let apisContext: any;

export async function init(apiDefinitions: ApiDefinition[], functionsFolder: Dictionary<any>) {
	if (!apisContext) {
		const modules: any = {};
		for (let apiDefinition of apiDefinitions)
			modules[apiDefinition.route!] = apiDefinition.module;

		const functions: any = {};
		addFunctions(functionsFolder, functions);

		apisContext = { ...modules, ...functions, modules: modules, functions: functions, };
	}
}

function addFunctions(functionsFolder: Dictionary<any>, functions: Dictionary<Function>) {
	Object.entries(functionsFolder).forEach(
		([key, value]) => {
			if (typeof value === 'function')
				functions[key] = value;
			else
				addFunctions(value, functions);
		}
	);
}

export function get() {
	return apisContext;
}
