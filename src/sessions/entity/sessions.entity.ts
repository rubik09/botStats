import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'sessions'})
export class SessionsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'longtext', default: ''})
    log_session: string;

    @Column({type: 'longtext', default: ''})
    keywords: string;

    @Column({type: 'varchar', length: 255})
    region: string;

    @Column({default: 1})
    status: boolean;

    @Column({type: 'varchar', length: 255, unique: true, default: ''})
    api_id: string;

    @Column({type: 'varchar', length: 255, unique: true, default: ''})
    api_hash: string;

    @Column({type: 'varchar', length: 255, unique: true})
    user_id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    username: string;

    @Column({type: 'varchar', length: 255, unique: true})
    phone_number: string;
}
