
export function isRequired(value: any) {
    return value ? true : false;
}

export function notEmpty(value: any) {
    return value && value.length > 0;
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export function isValidEmail(value: any) {
    return emailRegex.exec(value);
}

export function hasMinimumLength(value: any, args: any) {
    return value?.length > args;
}

const upperCaseRegex = /^(.*[A-Z].*)$/;
export function hasUpperCase(value: any) {
    return upperCaseRegex.exec(value);
}