
export function sum(array: any[], property: string): number {
	return array.reduce((acc, curr) => acc + curr[property], 0);
}