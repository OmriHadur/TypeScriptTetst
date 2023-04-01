
import Dictionary from "../../general/dictionary";
import ApiDefinition from "./apiDefinition";
import ResourceDefinition from "./resourceDefinition";

export default class ServerDefinitions {
	apisDic: Dictionary<ApiDefinition>;
	datasDic: Dictionary<ResourceDefinition>;

	constructor(public apis: ApiDefinition[], public datas: ResourceDefinition[]) {
		this.apisDic = apis.reduce((obj, item) => {
			obj[item.name] = item;
			return obj;
		}, {} as Dictionary<ApiDefinition>);

		this.datasDic = datas.reduce((obj, item) => {
			obj[item.name] = item;
			return obj;
		}, {} as Dictionary<ResourceDefinition>);
	}
}