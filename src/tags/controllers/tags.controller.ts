import { UpdateTagDto } from './../models/update-tag.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';
import { ITokenPayload } from './../../auth/models/token.interface';
import { CreateTagDto } from './../models/create-tag.dto';
import { IQueryParams } from './../models/query-params.interface';
import { TagsService } from './../services/tags.service';
import { Tag } from '../models/tag.entity';

@Controller('/tag')
export class TagsController {
  constructor(private tagsService: TagsService) {}
  // Create tag with cretor set to current authenticated user
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(@Req() req: Request, @Body() createTagDto: CreateTagDto) {
    const { user } = req;
    const { creatorId, ...tag } = await this.tagsService.createTag(
      createTagDto,
      user as ITokenPayload,
    );
    return tag;
  }

  // Update with provided id
  // If current logged user is not creator of mentioned tag throw error
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTag(
    @Param('id') id: number,
    @Req() { user }: Request,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    const { uid } = user as ITokenPayload;
    const tag = await this.tagsService.updateTag(id, updateTagDto, uid);
    return tag;
  }

  // Get one tag based on provided id
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { user } = req;
    const { uid } = user as ITokenPayload;
    await this.tagsService.deleteTag(id, uid);
    return res.sendStatus(HttpStatus.CREATED);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<Tag> {
    return this.tagsService.getOneTag(id);
  }

  // Get many Tags
  // Takes query params (sortByName, sortByOrder, length, offset)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMany(
    @Req() { user }: Request,
    @Query({
      transform: (query) => {
        for (let key in query) {
          if (!query[key]) {
            query[key] = true;
          }
        }
        return query;
      },
    })
    query: IQueryParams,
  ) {
    const { uid } = user as ITokenPayload;
    const tags = await this.tagsService.getManyTags(query, uid);
    return { tags };
  }
}
