import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import {bigintTransformer} from "../../utils/bigintTransformer";

@Entity({name: 'sessions'})
export class Sessions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'longtext', default: ''})
    logSession: string;

    @Column({type: 'longtext', default: ''})
    keywords: string;

    @Column({type: 'varchar', length: 40})
    region: string;

    @Column({default: 1})
    status: boolean;

    @Column({
        unique: true,
        type: 'bigint',
        default: '',
        transformer: bigintTransformer,
    })
    apiId: number;

    @Column({type: 'varchar', length: 40, unique: true, default: ''})
    apiHash: string;

    @Column({
        unique: true,
        type: 'bigint',
        transformer: bigintTransformer,
    })
    userId: number;

    @Column({type: 'varchar', length: 40, unique: true})
    username: string;

    @Column({type: 'varchar', length: 40, unique: true})
    phoneNumber: string;

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone', onUpdate: "CURRENT_TIMESTAMP", nullable: true})
    updatedAt: Date;
}
