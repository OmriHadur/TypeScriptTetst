import ApiContex from "../../data/apiContex";
import ApiRequest from "../../data/apiRequest";

export default class FindOneRequest extends ApiRequest<any> {
    constructor(
        contex: ApiContex,
        public route: string,
        public predicate: string) {
        super(contex);
    }
}