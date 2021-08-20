import { Tag } from './../tags/models/tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTag } from 'src/user-tag/models/user-tag.entity';

@Injectable()
export class CommonTagService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(UserTag) private userTagRepository: Repository<UserTag>,
  ) {}
  findTagsByIds(ids: number[]): Promise<Tag[]> {
    return this.tagRepository.findByIds(ids, {
      select: ['id', 'name', 'sortOrder'],
    });
  }
  findTagsCreatedByUser(uid: string): Promise<Tag[]> {
    return this.tagRepository.find({ where: { creatorId: uid } });
  }

  createUserTag(tagId: number, uid: string): Promise<UserTag> {
    return this.userTagRepository.save({ targetId: uid, tagId });
  }
}
