
export function positive(value: number) {
	return value > 0;
}

export function negative(value: number) {
	return value < 0;
}

export function range(value: number, minimum: number, maximum: number) {
	return value >= minimum && value < maximum;
}