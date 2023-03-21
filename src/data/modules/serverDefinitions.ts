
import ApiDefinition from "./apiDefinition";
import ResourceDefinition from "./resourceDefinition";

export default class ServerDefinitions {
	apis: ApiDefinition[];
	datas: ResourceDefinition[];

	constructor() {
		this.apis = [];
		this.datas = [];
	}
}