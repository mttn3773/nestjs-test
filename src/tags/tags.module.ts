import { UserTagsService } from './services/user-tags.service';
import { UserTagsController } from './controllers/user-tags-controller';
import { UserTag } from './models/user-tag.entity';
import { UsersModule } from './../users/users.module';
import { UsersService } from './../users/services/users.service';
import { Tag } from './models/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TagsController } from './controllers/tags.controller';
import { TagsService } from './services/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, UserTag])],
  controllers: [TagsController, UserTagsController],
  providers: [TagsService, UserTagsService],
})
export class TagsModule {}
