import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configs from '../../../../building-blocks/configs/configs';
import { IUserRepository } from '../../../src/domain/repositories/iuser.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      @Inject(IUserRepository) private readonly userRepository: IUserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configs.jwt.secret,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Cek apakah user dari token masih ada di database
    const userId = payload.sub;
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
        throw new UnauthorizedException();
    }
    // Payload ini akan ditambahkan ke object `req.user`
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}