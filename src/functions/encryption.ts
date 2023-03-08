import bcryptjs from 'bcryptjs';

export function encrypt(password: string) {
    return password ? bcryptjs.hash(password, 5) : undefined;
}

export function isMatch(hashedPassword: string, password: string) {
    return bcryptjs.compare(hashedPassword, password);
}

export function createToken(entity: any) {
    return entity.email + "-" + entity.hashedPassword;
}