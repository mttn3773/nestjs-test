import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../../tags/models/tag.entity';
import { User } from '../../users/models/user.entity';

@Entity()
export class UserTag extends BaseEntity {
  @PrimaryColumn()
  targetId: string;
  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'targetId' })
  target: User;

  @PrimaryColumn()
  tagId: number;
  @ManyToOne(() => Tag, (tag) => tag.shares)
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
