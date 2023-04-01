import Dictionary from "./dictionary";

const instances: Dictionary<any> = new Dictionary<any>();

export function get(type: string) {
	return instances[type];
}

export function set(instance: any, name?: string) {
	return instances[name ?? instance.constructor.name] = instance;
}