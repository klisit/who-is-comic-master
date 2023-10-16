import { Anime } from 'src/analysis/anime.entitiy';
import { Profile } from 'src/user/profile.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commentator: string;

  @Column({ type: 'double' })
  score: number;

  @Column({ type: 'double' })
  diffScore: number;

  @Column({ type: 'double' })
  realScore: number;

  @Column()
  comment: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Anime)
  @JoinColumn()
  anime: Anime;
}
