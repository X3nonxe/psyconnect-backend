import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import configs from '../../../../building-blocks/configs/configs';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		// Jika tidak ada IP yang di-whitelist di konfigurasi, izinkan semua request (default aman)
		if (configs.ipWhitelist.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		// Dapatkan IP klien. Catatan: di lingkungan produksi di belakang reverse proxy, 
		// Anda mungkin perlu mengkonfigurasi 'trust proxy' agar mendapatkan IP yang benar.
		const clientIp = request.ip;

		if (configs.ipWhitelist.includes(clientIp)) {
			return true; // Izinkan jika IP klien ada di dalam daftar
		}

		// Tolak jika IP tidak ada di daftar
		throw new ForbiddenException(
			'Access from this IP address is not allowed.',
		);
	}
}