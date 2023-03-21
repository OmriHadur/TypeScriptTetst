import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key_here';

export async function createToken(object: any): Promise<string> {
	return jwt.sign(object, secretKey);
}

export async function verifyToken(token: string): Promise<any> {
	return jwt.verify(token, secretKey);
}