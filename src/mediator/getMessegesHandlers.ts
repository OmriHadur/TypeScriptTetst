import Dictionary from '../general/dictionary';

export default async function (handlersFolder: Dictionary<any>): Promise<Dictionary<any[]>> {
	const messegesHandlers = new Dictionary<any[]>();
	Object.entries(handlersFolder).forEach(([handlersFolder, handlersFile]) => {
		const handlerInstance = new handlersFile.default();
		const messegeType = handlerInstance.messegeType ?? "*";
		messegesHandlers[messegeType] = messegesHandlers[messegeType] ?? [];
		messegesHandlers[messegeType].push(handlerInstance.handle);
	});

	return messegesHandlers;
}