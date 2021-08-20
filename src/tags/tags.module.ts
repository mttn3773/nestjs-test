import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonTagModule } from './../common-tag/common-tag.module';
import { TagsController } from './controllers/tags.controller';
import { Tag } from './models/tag.entity';
import { TagsService } from './services/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), CommonTagModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
