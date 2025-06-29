import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configs from '../../../../building-blocks/configs/configs';

interface JwtPayload {
	sub: string;
	email: string;
	role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configs.jwt.secret, // Harus menggunakan secret yang sama dengan auth-service
		});
	}

	// Cukup kembalikan payload jika token valid. Tidak perlu query ke DB.
	async validate(payload: JwtPayload) {
		return { userId: payload.sub, email: payload.email, role: payload.role };
	}
}