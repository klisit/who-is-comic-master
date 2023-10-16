import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Score } from 'src/score/score.entitiy';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  @OneToOne(() => User) //链表
  @JoinColumn() //增加表的管理
  user: User;

  @OneToOne(() => Score, (score) => score.profile, { cascade: true })
  score: Score;
}
