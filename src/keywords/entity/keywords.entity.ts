import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {UserSession} from "../../userSession/entity/userSession.entity";

@Entity({ name: 'keywords' })
export class Keywords {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar'})
  activity: string;

  @Column({ type: 'varchar'})
  keyword: string;

  @ManyToOne(() => UserSession, (userSession) => userSession.keywords, { onDelete: 'CASCADE' })
  userSession: UserSession;

  @Column({ default: 0 })
  count: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
