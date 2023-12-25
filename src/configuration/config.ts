import * as pack from '../../package.json';

export default (): any =>
  ({
    API_PREFIX: '/api',
    API_VERSION: '/v1',
    SERVICE_NAME: pack.name,
    HTTP_PORT: Number(process.env.HTTP_PORT),
    LOG_LEVEL: process.env.LOG_LEVEL,
    SECRET_JWT: process.env.SECRET_JWT,
    BOT_TOKEN: process.env.BOT_TOKEN,
    WEBHOOK_HOST: process.env.WEBHOOK_HOST,
  }) as const;
