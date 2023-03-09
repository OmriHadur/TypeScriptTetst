import ApiDefinition from "../data/apiDefinition";
import getFunctions from "./getFunctions";

let apisContext: any;

export async function init(apiDefinitions: ApiDefinition[], functionsFolder: string, functionsImportFolder: string) {
    if (!apisContext) {
        const modules: any = {};
        for (let apiDefinition of apiDefinitions)
            modules[apiDefinition.route!] = apiDefinition.module;
        const functions = await getFunctions(functionsFolder, functionsImportFolder);
        apisContext = { ...modules, ...functions, modules: modules, functions: functions };
    }
}

export function get() {
    return apisContext;
}