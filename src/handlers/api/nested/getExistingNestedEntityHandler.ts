import Result from "../../../mediator/Data/result";
import IRequestHandler from "../../../mediator/interfaces/requestHandler";
import GetExistingNestedEntityReqeust from "../../../messeges/api/nested/getExistingNestedEntityReqeust";

export default class GetExistingNestedEntityHandler implements IRequestHandler<GetExistingNestedEntityReqeust, any> {
	messegeType = GetExistingNestedEntityReqeust.name;

	async handle(request: GetExistingNestedEntityReqeust, result: Result<any>): Promise<void> {
		for (let nestedEntity of request.nestedEntities) {
			let isEquals = true;
			for (let [key] of Object.entries(request.nestedApi.types.create!))
				if (nestedEntity[key] != request.nestedEntity[key])
					isEquals = false;
			if (isEquals)
				result.value = nestedEntity;
		}
	}
}
