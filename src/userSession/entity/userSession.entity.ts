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
import {PersonalInfo} from "../../personalInfo/entity/personalInfo.entity";

enum userSessionStatus {
    Active = 'active',
    Disabled = 'disabled',
}

@Entity({name: 'sessions'})
export class UserSession {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => PersonalInfo, (personalInfo) => personalInfo.id, { cascade: true, eager: true })
    @JoinColumn()
    personalInfo: PersonalInfo['id'];

    @Column({type: 'varchar', default: ''})
    logSession: string;

    @Column({type: 'varchar', default: ''})
    keywords: string;

    @Column({
        type: "enum",
        enum: userSessionStatus,
        default: userSessionStatus.Active
    })
    status: userSessionStatus;

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
    telegramId: number;

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone'})
    updatedAt: Date;
}
