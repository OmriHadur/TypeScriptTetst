import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key_here';

export async function createToken(entity: any): Promise<string> {
	return jwt.sign({ id: entity._id, email: entity.email }, secretKey);
}

export async function verifyToken(token: string): Promise<any> {
	return jwt.verify(token, secretKey);
}