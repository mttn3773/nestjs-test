import { Tag } from './../tags/models/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommonTagService } from './common-tag.service';
import { UserTag } from 'src/user-tag/models/user-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, UserTag])],
  providers: [CommonTagService],
  exports: [CommonTagService],
})
export class CommonTagModule {}
