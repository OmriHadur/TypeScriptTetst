
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

export function minimumLength(value: any, args: any) {
    return value?.length > args;
}

const upperCaseRegex = /^(.*[A-Z].*)$/;
export function upperCase(value: any) {
    return upperCaseRegex.exec(value);
}