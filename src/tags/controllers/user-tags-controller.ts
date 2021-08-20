import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Tag } from '../models/tag.entity';
import { UserTag } from '../models/user-tag.entity';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { ITokenPayload } from './../../auth/models/token.interface';
import { AddUserTagsDto } from './../models/add-user-tags.dto';
import { UserTagsService } from './../services/user-tags.service';
@Controller('/user/tag')
export class UserTagsController {
  constructor(private userTagsService: UserTagsService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async addUserTags(
    @Req() { user }: Request,
    @Body() addUserTagsDto: AddUserTagsDto,
  ): Promise<Tag[]> {
    const { uid } = user as ITokenPayload;
    const tags = await this.userTagsService.addTagsToUser(addUserTagsDto, uid);
    return tags;
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyTags(
    @Req() { user }: Request,
    @Res() res: Response,
  ): Promise<Tag[]> {
    const { uid } = user as ITokenPayload;
    const tags = await this.userTagsService.findTagsCreatedByUser(uid);
    return tags;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUserTag(
    @Param('id') id: number,
    @Req() { user }: Request,
  ): Promise<UserTag[]> {
    const { uid } = user as ITokenPayload;
    await this.userTagsService.deleteTag(id, uid);
    const tags = await this.userTagsService.findTagsOfUser(uid);
    return tags;
  }
}
