import { Token } from '../entities/token.entity';

export const IAuthRepository = Symbol('IAuthRepository');

export interface IAuthRepository {
	createToken(token: Token): Promise<Token>;
}