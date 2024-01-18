import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({name: 'personalInfo'})
export class PersonalInfoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 40})
    region: string;

    @Column({default: true})
    status: boolean;

    @Column({type: 'varchar', length: 40, unique: true})
    username: string;

    @Column({type: 'varchar', length: 40, unique: true})
    phoneNumber: string;

    @CreateDateColumn({type: 'timestamp without time zone'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp without time zone'})
    updatedAt: Date;
}
