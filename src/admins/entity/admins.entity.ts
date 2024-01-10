import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'admins'})
export class AdminsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 40, unique: true})
    email: string;

    @Column({type: 'varchar', length: 40})
    password: string;
}
