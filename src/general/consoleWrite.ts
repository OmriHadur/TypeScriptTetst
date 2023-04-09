import CircularJSON from "circular-json";

export default (request: any, event: string, content?: any) => {
	const messege: any = {};
	const apiId = request.apiContex?.apiId;
	if (apiId)
		messege.apiId = apiId;
	messege.data = new Date();
	messege.name = request.constructor.name;
	messege.requestId = request.requestId;
	messege.event = event;
	if (content)
		messege.content = content;
	console.log(CircularJSON.stringify(messege));
}

