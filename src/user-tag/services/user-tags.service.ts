import { CommonTagService } from './../../common-tag/common-tag.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../tags/models/tag.entity';
import { AddUserTagsDto } from '../models/add-user-tags.dto';
import { UserTag } from '../models/user-tag.entity';

@Injectable()
export class UserTagsService {
  constructor(
    @InjectRepository(UserTag)
    private userTagRepositary: Repository<UserTag>,
    private commonTagService: CommonTagService,
  ) {}
  async createUserTag(tagId: number, targetId: string): Promise<UserTag> {
    const userTag = this.userTagRepositary.create({ tagId, targetId });
    await userTag.save();
    return userTag;
  }
  async addTagsToUser(
    { tags: ids }: AddUserTagsDto,
    uid: string,
  ): Promise<Tag[]> {
    const tags = await this.commonTagService.findTagsByIds(ids);
    if (tags.length < ids.length)
      throw new BadRequestException('Не все перечисленные теги существуют');
    const userTagsArr: UserTag[] = [];
    tags.forEach((tag) => {
      const userTag = this.userTagRepositary.create({
        targetId: uid,
        tagId: tag.id,
      });
      userTagsArr.push(userTag);
    });
    await this.userTagRepositary.save(userTagsArr);
    return tags;
  }

  async deleteTag(tagId: number, userId: string) {
    const userTag = await this.userTagRepositary.findOne({
      where: { tagId, targetId: userId },
    });
    if (!userTag) throw new UnauthorizedException();
    await this.userTagRepositary.delete({ targetId: userId, tagId });
    return;
  }
  findTagsOfUser(uid: string): Promise<UserTag[]> {
    return this.userTagRepositary.find({ where: { targetId: uid } });
  }
  findTagsCreatedByUser(uid: string): Promise<Tag[]> {
    return this.commonTagService.findTagsCreatedByUser(uid);
  }
}
