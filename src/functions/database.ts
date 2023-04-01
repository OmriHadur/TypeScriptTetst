import { get } from "../general/static"
import IMediator from "../mediator/interfaces/mediator";
import Mediator from "../mediator/mediator";
import DeleteByIdRequest from "../messeges/persistence/mongo/deleteByIdRequest";
import FindOneRequest from "../messeges/persistence/mongo/findOneRequest";
import GetByIdRequest from "../messeges/persistence/mongo/getByIdRequest";

const mediator = () => get(Mediator.name) as IMediator;

export function getById(route: string, entityId: string) {
	return mediator().sendValue(new GetByIdRequest(route, entityId));
}

export function findOne(route: string, predicate: any) {
	return mediator().sendValue(new FindOneRequest(route, predicate));
}

export function deleteById(route: string, entityId: any) {
	return mediator().sendValue(new DeleteByIdRequest(route, entityId));
}
