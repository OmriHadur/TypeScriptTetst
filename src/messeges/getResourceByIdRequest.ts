import ApiDefinition from "../data/apiDefinition";
import IRequest from "../mediator/interfaces/request";

export default class GetResourceByIdRequest implements IRequest<any> {
    constructor(public api: ApiDefinition, public id: string) {
    }
}