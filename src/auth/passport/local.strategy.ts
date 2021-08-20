import { LoginUserDto } from './../models/login-user.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('Local Strategy');
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({
      email,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('Неправильные данные');
    }
    return user;
  }
}
