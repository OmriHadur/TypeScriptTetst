import { range } from "./number";

export function required(value: any) {
	return value ? true : false;
}

export function notEmpty(value: any) {
	return value && value.length > 0;
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export function validEmail(value: any) {
	return emailRegex.exec(value) != null;
}

export function minimumLength(value: any, minimum: number) {
	if (!value || value.length < minimum)
		return { minimum: minimum };
}

export function maximumLength(value: any, maximum: number) {
	if (!value || value.length > maximum)
		return { maximum: maximum };
}

export function length(value: any, rangeValue: number[]) {
	return range(value.length, rangeValue);
}

export function lengthExact(value: any, length: number) {
	return value?.length == length;
}

const upperCaseRegex = /^(.*[A-Z].*)$/;
export function upperCase(value: any) {
	return upperCaseRegex.exec(value) != null;
}

export function boolean(value: any) {
	return value == true || value == false;
}

const validIdRegex = /^[0-9a-fA-F]{24}$/;

export function validId(value: string) {
	return validIdRegex.exec(value) != null;
}