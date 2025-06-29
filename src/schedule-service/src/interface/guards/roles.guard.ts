import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../domain/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		// Mengambil peran yang dibutuhkan dari metadata endpoint
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// Jika tidak ada peran yang dibutuhkan, izinkan akses
		if (!requiredRoles) {
			return true;
		}

		// Mengambil data user dari request (yang telah di-attach oleh JwtStrategy)
		const { user } = context.switchToHttp().getRequest();

		// Memeriksa apakah peran user ada di dalam daftar peran yang diizinkan
		return requiredRoles.some((role) => user.role?.includes(role));
	}
}