import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'admins'})
export class AdminsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;
}
