
export function required(value: any) {
	return value ? true : false;
}

export function notEmpty(value: any) {
	return value && value.length > 0;
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export function validEmail(value: any) {
	return emailRegex.exec(value);
}

export function minimumLength(value: any, minimumValue: number) {
	return value?.length > minimumValue;
}

export function maximumLength(value: any, maximumValue: number) {
	return value?.length < maximumValue;
}

export function lengthInRange(value: any, range: number[]) {
	return minimumLength(value, range[0]) && (range.length == 1 || maximumLength(value, range[1]));
}

export function lengthExact(value: any, length: number) {
	return value?.length == length;
}

const upperCaseRegex = /^(.*[A-Z].*)$/;
export function upperCase(value: any) {
	return upperCaseRegex.exec(value);
}