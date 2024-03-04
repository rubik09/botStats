import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AdminRoles } from '../admins.constants';

@Entity({ name: 'admins' })
export class Admins {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 240 })
  password: string;

  @Column({ type: 'enum', enum: AdminRoles, default: AdminRoles.ADMIN })
  adminRoles: AdminRoles;
}
