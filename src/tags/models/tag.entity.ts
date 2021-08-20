import { User } from './../../users/models/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserTag } from './user-tag.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: string;
  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserTag, (userTag) => userTag.tag)
  shares: UserTag[];

  @Column({ default: 0 })
  sortOrder: number;
}
