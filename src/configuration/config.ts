import * as pack from '../../package.json';
import {DataSource, DataSourceOptions} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import * as dotenv from 'dotenv';

dotenv.config();

const {
    MYSQL_PASSWORD,
    DB_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_DATABASE,
    HTTP_PORT,
    LOG_LEVEL,
    SECRET_JWT,
    BOT_TOKEN,
    WEBHOOK_HOST
} = process.env;

const DB_TYPE = process.env.DB_TYPE as 'postgres';

const DataSourceOption: DataSourceOptions = {
    type: DB_TYPE,
    host: DB_HOST,
    port: +MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    synchronize: false,
};
new DataSource(DataSourceOption);

export default (): any =>
    ({
        API_PREFIX: '/api',
        API_VERSION: '/v1',
        SERVICE_NAME: pack.name,
        HTTP_PORT: +HTTP_PORT,
        LOG_LEVEL: LOG_LEVEL,
        SECRET_JWT: SECRET_JWT,
        BOT_TOKEN: BOT_TOKEN,
        WEBHOOK_HOST: WEBHOOK_HOST,
        POSTGRES_DB_SETTINGS: DataSourceOption,
        namingStrategy: new SnakeNamingStrategy(),
    }) as const;
