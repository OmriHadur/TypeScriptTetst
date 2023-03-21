import Result from "../../../mediator/Data/result";
import IMediator from "../../../mediator/interfaces/mediator";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import AlterResourcesRequest from "../../../messeges/api/batch/alterResourcesRequest";
import AlterResourceRequest from "../../../messeges/api/crud/alterResourceRequest";


export default class AlterResourcesHandler implements IRequestHandler<AlterResourcesRequest, any> {
	messegeType = AlterResourcesRequest.name;

	async handle(request: AlterResourcesRequest, result: Result<any>, mediator: IMediator): Promise<void> {
		const results = [];
		for (let resource of request.resources) {
			const resourceRequest = new AlterResourceRequest(request.api, request.operation, resource, resource.id);
			resourceRequest.apiContex = request.apiContex;
			const result = await mediator.send(resourceRequest);
			results.push(result.isError() ? result.error : result.value);
		}
		result.value = results;
	}
}
