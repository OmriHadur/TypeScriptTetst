
export function toCurrency(number: number): number {
	return +new Number(number).toFixed(2);
}
