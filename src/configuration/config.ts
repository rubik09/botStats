import * as pack from '../../package.json';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import * as dotenv from 'dotenv';

dotenv.config();

const {
    HTTP_PORT,
    LOG_LEVEL,
    SECRET_JWT,
    BOT_TOKEN,
    WEBHOOK_HOST,
    DB_TYPE,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_SYNCHRONIZE,
    KAFKA_EVENTS_BROKERS,
    INCOMING_MESSAGE,
    OUTGOING_MESSAGE,
    GROUP_ID,
    CRON_TIME_NIGHT,
    CRON_TIME_DAY
} = process.env;


export default (): any =>
    ({
        API_PREFIX: '/api',
        API_VERSION: '/v1',
        SERVICE_NAME: pack.name,
        HTTP_PORT: Number(HTTP_PORT),
        LOG_LEVEL: LOG_LEVEL,
        SECRET_JWT: SECRET_JWT,
        BOT_TOKEN: BOT_TOKEN,
        WEBHOOK_HOST: WEBHOOK_HOST,
        POSTGRES_DB_SETTINGS: {
            type: DB_TYPE,
            host: DB_HOST,
            port: Number(DB_PORT) || 5432,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_DATABASE,
            autoLoadEntities: true,
            synchronize: DB_SYNCHRONIZE,
            namingStrategy: new SnakeNamingStrategy(),
        },
        KAFKA: {
            brokers: KAFKA_EVENTS_BROKERS.split(','),
            // ssl: { rejectUnauthorized: false },
            // sasl: {
            //   mechanism: 'plain',
            //   username: process.env.KAFKA_SASL_USERNAME,
            //   password: process.env.KAFKA_SASL_PASSWORD,
            // },
        },
        KAFKA_TOPICS: {
            INCOMING_MESSAGE: INCOMING_MESSAGE,
            OUTGOING_MESSAGE: OUTGOING_MESSAGE,
        },
        GROUP_ID: {
            GROUP_ID: GROUP_ID,
        },
        CRON: {
            CRON_TIME_NIGHT: CRON_TIME_NIGHT,
            CRON_TIME_DAY: CRON_TIME_DAY,
        }
    }) as const;
