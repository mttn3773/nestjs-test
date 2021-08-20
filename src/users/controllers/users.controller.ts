import { ITokenPayload } from './../../auth/models/token.interface';
import { UpdateUserDto } from './../models/update-user.dto';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { UsersService } from './../services/users.service';
import {
  Controller,
  Get,
  Req,
  Put,
  UseGuards,
  Body,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../models/user.entity';
@Controller('/user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async user(@Req() { user }: Request): Promise<Partial<User>> {
    const { uid } = user as ITokenPayload;
    const result = await this.userService.findOneWithTags(uid);
    return result;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<Partial<User>> {
    const user = req.user;
    const updatedUser = await this.userService.updateUser(
      updateUserDto,
      user as ITokenPayload,
    );
    return updatedUser;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Res() res: Response, @Req() req: Request) {
    const { user } = req;
    await this.userService.deleteUser(user as ITokenPayload, res);
    return res.sendStatus(HttpStatus.CREATED);
  }
}
