
export function required(value: any) {
    return value ? true : false;
}

export function notEmpty(value: any) {
    return value && value.length > 0;
}

export function validEmail(value: any) {
    return true;
}

export function minimumLength(value: any, args: any) {
    return value?.length > args;
}


export function upperCase(value: any) {
    return true;
}