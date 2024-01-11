import * as pack from '../../package.json';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import * as dotenv from 'dotenv';

dotenv.config();

export default (): any =>
    ({
        API_PREFIX: '/api',
        API_VERSION: '/v1',
        SERVICE_NAME: pack.name,
        HTTP_PORT: Number(process.env.HTTP_PORT),
        LOG_LEVEL: process.env.LOG_LEVEL || logger.LogLevels.INFO,
        SECRET_JWT: process.env.SECRET_JWT,
        BOT_TOKEN: process.env.BOT_TOKEN,
        WEBHOOK_HOST: process.env.WEBHOOK_HOST,
        DEFAULT_MANAGER_LINK: process.env.DEFAULT_MANAGER_LINK,
        DEFAULT_CONCIERGE_LINK: process.env.DEFAULT_CONCIERGE_LINK,
        POSTGRES_DB_SETTINGS: {
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            autoLoadEntities: true,
            synchronize: process.env.DB_SYNCHRONIZE,
            namingStrategy: new SnakeNamingStrategy(),
        },
    }) as const;
