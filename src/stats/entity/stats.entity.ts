import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'stats'})
export class StatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 300})
    api_id_client: string;

    @Column({default: 0})
    incoming_messages_count: number;

    @Column({default: 0})
    users_count: number;
}
