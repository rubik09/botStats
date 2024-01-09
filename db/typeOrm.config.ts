import {DataSource, DataSourceOptions} from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const {MYSQL_PASSWORD, DB_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_DATABASE} = process.env;
export const DataSourceOption: DataSourceOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: +MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    entities: ['dist/**/*.entity{ .ts,.js}'],
    synchronize: false,
    migrations: ['dist/**/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_history',
    migrationsRun: true,
};
new DataSource(DataSourceOption);
