import Dictionary from '../general/dictionary';

export default async function (handlersFolder: Dictionary<any>): Promise<Dictionary<any[]>> {
	const messegesHandlers = new Dictionary<any[]>();
	addHandlers(handlersFolder, messegesHandlers);
	return messegesHandlers;
}

function addHandlers(handlersFolder: Dictionary<any>, handlers: Dictionary<any[]>) {
	Object.entries(handlersFolder).forEach(([key, value]) => {
		if (value.default) {
			const handlerInstance = new value.default();
			const messegeType = handlerInstance.messegeType ?? "*";
			handlers[messegeType] = handlers[messegeType] ?? [];
			handlers[messegeType].push(handlerInstance);
		}
		else
			addHandlers(value, handlers);
	});
}