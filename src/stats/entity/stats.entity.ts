import {
    Column, CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {bigintTransformer} from "../../utils/bigintTransformer";

@Entity({name: 'stats'})
export class StatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        type: 'bigint',
        transformer: bigintTransformer,
    })
    apiIdClient: number;

    @Column({default: 0})
    incomingMessagesCount: number;

    @Column({default: 0})
    usersCount: number;

    @CreateDateColumn({type: 'timestamp without time zone', default: () => "CURRENT_TIMESTAMP", nullable: false})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone', onUpdate: "CURRENT_TIMESTAMP", nullable: true})
    updatedAt: Date;
}
