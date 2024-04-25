import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CalculatedKeywords } from '../../utils/interfaces';

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
  calculatedKeywords: CalculatedKeywords[];

  @Column({ type: 'varchar', length: 40 })
  time: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;
}
