
export function sum(array: any[], property: string) {
	return array.reduce((acc, curr) => acc + curr[property], 0);
}