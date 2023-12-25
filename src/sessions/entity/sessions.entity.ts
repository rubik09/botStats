import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'sessions'})
export class SessionsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'longtext'})
    log_session: string;

    @Column({type: 'longtext'})
    keywords: string;

    @Column({type: 'varchar', length: 255})
    region: string;

    @Column()
    status: boolean;

    @Column({type: 'varchar', length: 255, unique: true})
    api_id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    api_hash: string;

    @Column({type: 'varchar', length: 255, unique: true})
    user_id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    username: string;

    @Column({type: 'varchar', length: 255, unique: true})
    phone_number: string;
}
