import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authUser: AuthUserDto) {
    try {
      const user = await this.usersService.find(authUser);
      const payload = { sub: user.id, username: user.name, admin: user.admin };
      delete user.admin;
      return {
        access_token: await this.jwtService.signAsync(payload),
        user,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
