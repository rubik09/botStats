import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import {bigintTransformer} from "../../utils/bigintTransformer";
import {PersonalInfoEntity} from "../../personalInfo/entity/personalInfo.entity";

@Entity({name: 'sessions'})
export class UserSessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PersonalInfoEntity, (personalInfo) => personalInfo.id, { cascade: true, eager: true })
    @JoinColumn()
    personalInfo: PersonalInfoEntity['id'];

    @Column({type: 'varchar', default: ''})
    logSession: string;

    @Column({type: 'varchar', default: ''})
    keywords: string;

    @Column({default: true})
    status: boolean;

    @Column({
        unique: true,
        type: 'bigint',
        default: null,
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

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone'})
    updatedAt: Date;
}
