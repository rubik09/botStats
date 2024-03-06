import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { PersonalInfo } from '../../personalInfo/entity/personalInfo.entity';
import { bigintTransformer } from '../../utils/bigintTransformer';
import {Keywords} from "../../keywords/entity/keywords.entity";

export enum userSessionStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity({ name: 'sessions' })
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PersonalInfo, (personalInfo) => personalInfo.id, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  personalInfo: PersonalInfo;

  @Column({ type: 'varchar', default: '' })
  logSession: string;

  @OneToMany(() => Keywords, (keywords) => keywords.userSession, { cascade: true })
  keywords: Keywords[];

  @Column({
    type: 'enum',
    enum: userSessionStatus,
    default: userSessionStatus.DISABLED,
  })
  status: userSessionStatus;

  @Column({
    unique: true,
    type: 'bigint',
    default: null,
    transformer: bigintTransformer,
  })
  apiId: number;

  @Column({ type: 'varchar', length: 40, unique: true, default: null })
  apiHash: string;

  @Column({
    unique: true,
    type: 'bigint',
    transformer: bigintTransformer,
  })
  telegramId: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;
}
