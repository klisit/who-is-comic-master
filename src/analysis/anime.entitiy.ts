import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //番剧yuc列表链接
  hashUrl: string;

  @Column() //番剧名称
  nameZh: string;

  @Column() //番剧名称
  nameJp: string;

  @Column() //番剧类型
  type: string;

  @Column() //番剧分类
  cate: string;

  @Column({ default: null }) //番剧封面
  cover: string | null;

  @Column() //番剧官网预告
  official: string;

  @Column({ default: null }) //pv
  officialPreview: string | null;

  @Column({ type: 'text' }) //工作人员
  staff: string;

  @Column() //番剧放映时间  星期x/xx:xx
  schedule: string;

  @Column() //番剧放映 附加信息
  scheduleLabel: string;

  @Column({ type: 'text' }) //声优
  cv: string;
}
