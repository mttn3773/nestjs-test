import { UserTag } from './../../tags/models/user-tag.entity';
import { Tag } from './../../tags/models/tag.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @OneToMany(() => UserTag, (tag) => tag.target, { onDelete: 'CASCADE' })
  tags: UserTag[];
}
