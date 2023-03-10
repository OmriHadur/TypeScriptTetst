import bcryptjs from 'bcryptjs';

export function encrypt(password: string) {
    return password ? bcryptjs.hash(password, 5) : undefined;
}

export async function isMatch(hashedPassword: string, password: string) {
    if (!hashedPassword || !password)
        return false;
    return bcryptjs.compare(password, hashedPassword);
}