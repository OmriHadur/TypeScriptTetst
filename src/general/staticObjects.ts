import Dictionary from "./dictionary";

const types: Dictionary<any> = new Dictionary();

export function get(typeName: string) {
    return types[typeName];
}

export function set(object: any) {
    return types[object.constructor.name] = object;
}