import { User } from './../../users/models/user.entity';
import { ITokens, ITokenPayload, IToken } from './../models/token.interface';
import { LoginUserDto } from './../models/login-user.dto';
import { CreateUserDto } from './../../users/models/create-user.dto';
import { UsersService } from './../../users/services/users.service';
import {
  Injectable,
  Res,
  Logger,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth Service');
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    { email, password, nickname }: CreateUserDto,
    @Res() res: Response,
  ): Promise<IToken> {
    const user = await this.userService.createUser({
      email,
      password,
      nickname,
    });
    const token = this.login(user, res);
    return token;
  }

  login(user: User, @Res() res: Response): IToken {
    // Sign access token and refresh tokens
    const { accessToken, refreshToken } = this.signTokens(user);
    // Set refresh token to cookie
    this.setRefreshTokenToCookie(refreshToken, res);
    return { token: accessToken, expire: 1800 };
  }
  async logout(res: Response) {
    res.clearCookie('refresh_token');
  }
  async refreshToken(req: Request, res: Response): Promise<string> {
    // Check if token exists
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException();

    // Check if token is not corrupted
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    }) as ITokenPayload;
    if (!payload) throw new UnauthorizedException();

    // Check if user in database
    const { uid } = payload;
    const validUser = await this.userService.findOne(uid);
    if (!validUser) throw new UnauthorizedException();

    // Sign new access and refresh_tokens
    const { accessToken, refreshToken } = this.signTokens(validUser);

    // Refresh refresh token in cookies
    this.setRefreshTokenToCookie(refreshToken, res);

    // Return access token
    return accessToken;
  }

  async validateUser({
    email,
    password,
  }: LoginUserDto): Promise<Partial<User>> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const verify = await this.verifyPassword(user.password, password);
    if (!verify) return null;
    const { password: password_, ...result } = user;
    return result;
  }
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return verify(hash, password);
  }
  signTokens(user: User): ITokens {
    const { password, ...payload } = user;
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });
    return { accessToken, refreshToken };
  }

  setRefreshTokenToCookie(token: string, res: Response) {
    return res.cookie('refresh_token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: `/api/refresh`,
    });
  }
}
