import ApiContex from "../../data/apiContex";
import ApiRequest from "../../data/apiRequest";

export default class DeleteByIdRequest extends ApiRequest<any> {
    constructor(
        contex: ApiContex,
        public route: string,
        public entityId: string) {
        super(contex);
    }
}