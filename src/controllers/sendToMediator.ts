import { verifyToken } from "../functions/jwt";
import IMediator from "../mediator/interfaces/mediator";
import { GetRequestFunction, GetStatusCode } from "../types/apiRelated";
import ApiContex from "../data/apiContex";
import { get } from "../general/static"

const Authorization = 'Authorization';

export default function send(mediator: IMediator, getRequest: GetRequestFunction, statusCode: GetStatusCode = () => 200) {
	return async (apiRequest: any, apiResponse: any, nextApiMiddleware: any) => {
		const request = getRequest(apiRequest);
		request.apiContex = { ...get(ApiContex.name), variables: {} };
		try {
			const token = apiRequest.get(Authorization)?.split(' ')[1];
			if (token)
				request.apiContex.user = await verifyToken(token);
		} catch (err) { }
		const result = await mediator.send(request);
		if (result.isSuccess())
			apiResponse.status(statusCode(request)).json(result.value);
		else
			nextApiMiddleware(result.error);
	}
}