import { IToken } from './../models/token.interface';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/users/models/user.entity';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from './../../users/models/create-user.dto';
import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { LocalAuthGuard } from './../guards/local-auth.guard';
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  async register(
    @Body() userData: CreateUserDto,
    @Res() res: Response,
  ): Promise<IToken> {
    const token = await this.authService.register(userData, res);
    return token;
  }
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Res() res: Response, @Req() req: Request): IToken {
    const result = this.authService.login(req.user as User, res);
    return result;
  }
  @Post('/logout')
  async logout(@Res() res: Response) {
    this.authService.logout(res);
    return res.sendStatus(HttpStatus.OK);
  }
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<IToken> {
    const accessToken = await this.authService.refreshToken(req, res);
    return { token: accessToken, expire: 1800 };
  }
}
