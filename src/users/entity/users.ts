import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {bigintTransformer} from "../../utils/bigintTransformer";

@Entity({name: 'users'})
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'bigint',
        transformer: bigintTransformer,
    })
    userId: number;

    @Column({
        type: 'bigint',
        transformer: bigintTransformer,
    })
    apiIdClient: number;
}
