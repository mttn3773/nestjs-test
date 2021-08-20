import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { ITokenPayload } from './../../auth/models/token.interface';
import { TagsService } from './../../tags/services/tags.service';
import { CreateUserDto } from './../models/create-user.dto';
import { UpdateUserDto } from './../models/update-user.dto';
import { User } from './../models/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser({
    email,
    password,
    nickname,
  }: CreateUserDto): Promise<User> {
    await this.checkIfUserExists({ email, nickname });
    const hashedPassword = await hash(password);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });
    await user.save();
    return user;
  }
  async updateUser(
    updateUserDto: UpdateUserDto,
    { uid }: ITokenPayload,
  ): Promise<Partial<User>> {
    const { email = '', nickname = '', password = '' } = updateUserDto;
    await this.checkIfUserExists({ email, nickname });
    if (password) {
      const hashedPassword = await hash(password);
      updateUserDto.password = hashedPassword;
    }
    const user = await this.usersRepository.findOne(uid);
    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
    updatedUser.password = undefined;
    updatedUser.uid = undefined;
    return updatedUser;
  }
  async deleteUser({ uid }: ITokenPayload, res: Response) {
    await this.usersRepository.delete(uid);
    res.clearCookie('refresh_token');
  }
  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }
  findByNickname(nickname: string): Promise<User> {
    return this.usersRepository.findOne({ nickname });
  }
  async checkIfUserExists({ email, nickname }: UpdateUserDto) {
    // Check if user with provided name or email already exists in repostory
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .orWhere('u.nickname = :nickname', { nickname })
      .getOne();
    if (user) {
      const emailMatches = user.email === email;
      const nicknameMatches = user.nickname === nickname;
      const matchedFields = `${emailMatches ? 'email' : ''}${
        emailMatches && nicknameMatches ? ' и ' : ''
      }${nicknameMatches ? 'именем' : ''}`;

      throw new BadRequestException(
        `Пользователь с таким ${matchedFields} уже существует`,
      );
    }
    return;
  }
  async findOne(uid: string) {
    return this.usersRepository.findOne(uid);
  }
  async findOneWithTags(uid: string) {
    const res = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoin('u.tags', 'ut', 'ut.targetId = u.uid')
      .leftJoin('ut.tag', 't', 't.id = ut.tagId')
      .select([
        'u.email',
        'u.nickname',
        'ut.createdAt',
        't.id',
        't.name',
        't.sortOrder',
      ])
      .where({ uid })
      .getOne();
    return res;
  }
  findAll() {
    return this.usersRepository.find();
  }
}
