// auth-service/src/application/dtos/auth-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

class TokenDto {
  @ApiProperty({ description: 'The JWT token string.' })
  token: string;

  @ApiProperty({ description: 'The token expiration time in seconds.' })
  expiresIn: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: TokenDto })
  accessToken: TokenDto;

  @ApiProperty({ type: TokenDto })
  refreshToken: TokenDto;
}