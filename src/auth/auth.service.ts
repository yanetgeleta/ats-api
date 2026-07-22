import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

// Validates against the admin credentials and creates a jwt access token
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    // throws an exception if there is no admin with that email or the password is not valid
    if (!admin || !(await argon2.verify(admin.password, password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // sign a jwt token
    const payload = { sub: admin.id, email: admin.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
