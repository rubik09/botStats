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

  @Column({ type: 'json'})
  keyword: string;

  @Column({ default: 0 })
  count: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  @ManyToOne(() => UserSession, (userSession) => userSession.id, { onDelete: 'CASCADE' })
  userSession: UserSession;
}
