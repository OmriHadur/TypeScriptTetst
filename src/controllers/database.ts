import ApiContex from "../data/apiContex";
import IMediator from "../mediator/interfaces/mediator";
import DeleteByIdRequest from "../messeges/persistence/deleteByIdRequest";
import FindOneRequest from "../messeges/persistence/findOneRequest";
import GetByIdRequest from "../messeges/persistence/getByIdRequest";

export default class Database {
	private _api: string;
	private _mediator: IMediator;

	constructor(api: string, mediator: IMediator) {
		this._api = api;
		this._mediator = mediator;
	}

	getById(contex: ApiContex, entityId: string) {
		return this.send(GetByIdRequest, contex, entityId);
	}

	findOne(contex: ApiContex, predicate: any) {
		return this.send(FindOneRequest, contex, predicate);
	}

	deleteById(contex: ApiContex, entityId: any) {
		return this.send(DeleteByIdRequest, contex, entityId);
	}

	private send = async (type: any, contex: ApiContex, arg1?: any, arg2?: any, arg3?: any) =>
		this._mediator.sendValue(new type(contex, this._api, arg1, arg2, arg3));
}
