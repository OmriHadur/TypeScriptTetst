
export function sum(array: any[], property: string): number {
	if (!array)
		return 0;
	return array.reduce((acc, curr) => acc + curr[property], 0);
}