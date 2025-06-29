import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../../domain/entities/token.entity';
import { IAuthRepository } from '../../domain/repositories/iauth.repository';

@Injectable()
export class AuthRepository implements IAuthRepository {
	constructor(
		@InjectRepository(Token)
		private readonly tokenRepository: Repository<Token>,
	) { }

	async createToken(token: Token): Promise<Token> {
		return this.tokenRepository.save(token);
	}
}