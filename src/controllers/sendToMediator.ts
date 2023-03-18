import { verifyToken } from "../functions/jwt";
import IMediator from "../mediator/interfaces/mediator";
import { GetRequestFunction, GetStatusCode } from "../types/apiRelated";

export default function (mediator: IMediator, getRequest: GetRequestFunction, statusCode: GetStatusCode = () => 200) {
	return async (req: any, res: any, next: any) => {
		const request = getRequest(req);

		try {
			const token = req.get('Authorization')?.split(' ')[1];
			if (token)
				request.user = await verifyToken(token);
		} catch (err) {

		}
		const result = await mediator.send(request);
		if (result.isSuccess()) {
			res.status(statusCode(request)).json(result.value);
		}
		else
			next(result.error);
	}
}