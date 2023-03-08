import Dictionary from "../general/dictionary";

export default class Resolver {
    types: Dictionary<string[]>;
    objects: any;

    constructor() {
        this.types = new Dictionary();
        this.objects = {};
    }

    register(typeFrom: string, typeTo: string) {
        if (!this.types[typeFrom])
            this.types[typeFrom] = [];
        this.types[typeFrom].push(typeTo);
    }

    resolve<T>(typeName: string): T {
        const typeTo = this.types[typeName];
        return {} as T
    }
}