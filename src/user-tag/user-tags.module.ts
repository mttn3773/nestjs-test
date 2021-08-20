import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTag } from 'src/user-tag/models/user-tag.entity';
import { CommonTagModule } from './../common-tag/common-tag.module';
import { UserTagsController } from './controllers/user-tags-controller';
import { UserTagsService } from './services/user-tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTag]), CommonTagModule],
  providers: [UserTagsService],
  controllers: [UserTagsController],
})
export class UserTagsModule {}
