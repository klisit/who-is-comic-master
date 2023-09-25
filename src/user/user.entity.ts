import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { Profile } from './profile.entity';
// import { Roles } from '../roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) //设置唯一账号
  username: string;

  @Column()
  password: string;

  // typescript -> 数据库 关联关系 Mapping，
  //一对多
  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  //多对多
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  //, { cascade: true }设置连表更新 一对一
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}
