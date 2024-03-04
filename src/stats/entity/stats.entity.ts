import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { bigintTransformer } from '../../utils/bigintTransformer';

@Entity({ name: 'stats' })
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'bigint',
    transformer: bigintTransformer,
  })
  apiIdClient: number;

  @Column({ default: 0 })
  incomingMessagesCount: number;

  @Column({ default: 0 })
  outgoingMessagesCount: number;

  @Column({ default: 0 })
  usersCount: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
