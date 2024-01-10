import {
    Column, CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({name: 'stats'})
export class StatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    api_id_client: string;

    @Column({default: 0})
    incoming_messages_count: number;

    @Column({default: 0})
    users_count: number;

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone'})
    updatedAt: Date;
}
