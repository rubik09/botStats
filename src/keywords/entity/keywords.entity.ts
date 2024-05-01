import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserSession } from '../../userSession/entity/userSession.entity';

@Entity({ name: 'keywords' })
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  activity: string;

  @Column({ type: 'jsonb' })
  keyword: string;

  @Column({ default: 0 })
  count: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  @ManyToOne(() => UserSession, (userSession) => userSession.id, { onDelete: 'CASCADE' })
  userSession: number;
}
