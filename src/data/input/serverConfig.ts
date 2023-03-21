import Dictionary from "../../general/dictionary";
import ApiConfig from "./apiConfig";
import ResourceConfig from "./resourceConfig";


export default class ServerConfig {
	apis: Dictionary<ApiConfig>;
	data: Dictionary<ResourceConfig>;

	constructor() {
		this.apis = new Dictionary<ApiConfig>();
		this.data = new Dictionary<ResourceConfig>();
	}
}