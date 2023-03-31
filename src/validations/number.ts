
export function positive(value: number) {
	return value > 0;
}

export function negative(value: number) {
	return value < 0;
}

export function range(value: number, range: number[]) {
	if (!value || value < range[0] || value >  range[1])
		return { minimum:  range[0], maximum: range[1] };
}