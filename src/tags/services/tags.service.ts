import { CommonTagService } from './../../common-tag/common-tag.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserTag } from '../../user-tag/models/user-tag.entity';
import { UserTagsService } from '../../user-tag/services/user-tags.service';
import { IGetManyTags } from '../models/get-many-tags-response.interface';
import { Tag } from '../models/tag.entity';
import { ITokenPayload } from './../../auth/models/token.interface';
import { CreateTagDto } from './../models/create-tag.dto';
import { IQueryParams } from './../models/query-params.interface';
import { UpdateTagDto } from './../models/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    private commonTagService: CommonTagService,
  ) {}
  async createTag(
    { name, sortOrder = 0 }: CreateTagDto,
    { uid }: ITokenPayload,
  ) {
    // Validate tag
    const doesTagExist = await this.findTagByName(name);
    if (doesTagExist)
      throw new BadRequestException('Тег с таким названием уже существует');

    // Create tag in tag repository
    const tag = this.tagsRepository.create({
      name,
      sortOrder,
      creatorId: uid,
    });

    await tag.save();

    // Create user tag and add it to user
    await this.commonTagService.createUserTag(tag.id, uid);
    return tag;
  }

  async getOneTag(tagId: number) {
    const tag = await this.tagsRepository
      .createQueryBuilder('t')
      .leftJoin('t.creator', 'u', 'u.uid = t.creatorId')
      .select(['u.nickname', 'u.uid', 't.name', 't.sortOrder'])
      .where({ id: tagId })
      .getOne();
    if (!tag) throw new BadRequestException('Тег не найден');
    return tag;
  }
  async getManyTags(
    {
      sortByName = false,
      sortByOrder = false,
      length = 0,
      offset = 0,
    }: IQueryParams,
    uid: string,
  ): Promise<IGetManyTags> {
    const query = this.tagsRepository
      .createQueryBuilder('t')
      .where('u.uid = uid', { uid })
      .select(['u.nickname', 'u.uid', 't.name', 't.sortOrder', 't.id'])
      .leftJoin('t.creator', 'u', 'u.uid = t.creatorId');
    const quantity = await query.getCount();
    // Apply query settings based on query params to generated query
    const queryWitFeatures = this.applyApiFeature(query, {
      sortByName,
      sortByOrder,
      length,
      offset,
    });
    const tags = await queryWitFeatures.getMany();
    return { data: tags, meta: { length, offset, quantity } };
  }
  async deleteTag(tagId: number, uid: string) {
    const tag = await this.tagsRepository.findOne(tagId);
    if (!tag) throw new BadRequestException('Couldnt find this tag');
    this.checkIfUserIsCreator(tag, uid);
    await this.tagsRepository.delete(tag);
  }
  applyApiFeature(
    query: SelectQueryBuilder<Tag>,
    queryParams: IQueryParams,
  ): SelectQueryBuilder<Tag> {
    if (queryParams.length) {
      query.take(queryParams.length);
    }
    if (queryParams.offset) {
      query.offset(queryParams.offset);
    }
    if (queryParams.sortByOrder) {
      query.addOrderBy('t.sortOrder', 'ASC');
    }
    if (queryParams.sortByName) {
      query.addOrderBy('t.name', 'ASC');
    }
    return query;
  }
  async updateTag(id: number, updateTagDto: UpdateTagDto, uid: string) {
    const tag = await this.validateTag(uid, id, updateTagDto);
    const newTag = await this.tagsRepository.save({ ...tag, ...updateTagDto });
    return newTag;
  }
  findTagByName(name: string): Promise<Tag> {
    return this.tagsRepository.findOne({ name });
  }
  checkIfUserIsCreator(tag: Tag, uid: string): boolean {
    if (!(tag.creatorId === uid)) throw new UnauthorizedException();
    return true;
  }
  async validateTag(
    uid: string,
    tagId: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    const { name } = updateTagDto;
    // Check if tag with this name alredy exists
    const tagWithSameName = await this.tagsRepository.findOne({ name });
    if (tagWithSameName)
      throw new BadRequestException('Тег с таким именем уже существует');
    const tag = await this.tagsRepository.findOne(tagId);

    // Check if tag exists
    if (!tag) throw new BadRequestException('Неверный id');

    this.checkIfUserIsCreator(tag, uid);
    return tag;
  }
}
