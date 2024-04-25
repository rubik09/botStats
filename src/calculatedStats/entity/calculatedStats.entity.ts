import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Keyword } from '../../keywords/entity/keywords.entity';

@Entity({ name: 'calculatedStats' })
export class CalculatedStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  username: string;

  @Column()
  incomingMessagesCount: number;

  @Column()
  usersCount: number;

  @Column({ type: 'numeric' })
  averageMessagesCount: number;

  @Column({ type: 'jsonb' })
  keywords: Keyword[];

  @Column({ type: 'varchar', length: 40 })
  time: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
