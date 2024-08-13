import { HistogramConfiguration } from 'prom-client';

import { ICounterMetricConfig, IHistogramMetricConfig } from '../utils/interfaces';

export const HTTP_REQUEST_DURATION_SECONDS: HistogramConfiguration<string> = {
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 3, 5, 10],
};

export const CounterMetricsConfig: Record<string, ICounterMetricConfig> = {
  DB_REQUEST_KEYWORDS_TOTAL: {
    name: 'db_request_keywords_total',
    help: 'Total number of database requests for keywords',
    labelNames: ['method'],
  },
  DB_REQUEST_USER_SESSION_TOTAL: {
    name: 'db_request_userSession_total',
    help: 'Total number of database requests for user sessions',
    labelNames: ['method'],
  },
  DB_REQUEST_ADMINS_TOTAL: {
    name: 'db_request_admins_total',
    help: 'Total number of database requests for admins',
    labelNames: ['method'],
  },
  DB_REQUEST_CALCULATED_STATS_TOTAL: {
    name: 'db_request_calculatedStats_total',
    help: 'Total number of database requests for calculated stats',
    labelNames: ['method'],
  },
  DB_REQUEST_CRON_TOTAL: {
    name: 'db_request_cron_total',
    help: 'Total number of database requests for cron',
    labelNames: ['method'],
  },
  DB_REQUEST_PERSONAL_INFO_TOTAL: {
    name: 'db_request_personalInfo_total',
    help: 'Total number of database requests for personal info',
    labelNames: ['method'],
  },
  DB_REQUEST_STATS_TOTAL: {
    name: 'db_request_stats_total',
    help: 'Total number of database requests for stats',
    labelNames: ['method'],
  },
  DB_REQUEST_USERS_TOTAL: {
    name: 'db_request_users_total',
    help: 'Total number of database requests for users',
    labelNames: ['method'],
  },
};

export const HistogramMetricsConfig: Record<string, IHistogramMetricConfig> = {
  DB_REQUEST_KEYWORDS_DURATION: {
    name: 'db_request_keywords_duration',
    help: 'Duration of database requests for keywords in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_USER_SESSION_DURATION: {
    name: 'db_request_userSession_duration',
    help: 'Duration of database requests for user sessions in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_ADMINS_DURATION: {
    name: 'db_request_admins_duration',
    help: 'Duration of database requests for admins in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_CALCULATED_STATS_DURATION: {
    name: 'db_request_calculatedStats_duration',
    help: 'Duration of database requests for calculated stats in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_CRON_DURATION: {
    name: 'db_request_cron_duration',
    help: 'Duration of database requests for cron in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_PERSONAL_INFO_DURATION: {
    name: 'db_request_personalInfo_duration',
    help: 'Duration of database requests for personal info in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_STATS_DURATION: {
    name: 'db_request_stats_duration',
    help: 'Duration of database requests for stats in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
  DB_REQUEST_USERS_DURATION: {
    name: 'db_request_users_duration',
    help: 'Duration of database requests for users in seconds',
    labelNames: ['method', 'status'],
    buckets: [0.1, 0.5, 1, 3, 5, 10],
  },
};

export enum Status {
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum KeywordMethodNames {
  CREATE_NEW_KEYWORD = 'createNewKeyword',
  UPDATE_NEW_KEYWORD = 'updateNewKeyword',
  DELETE_KEYWORD = 'deleteKeyword',
  GET_KEYWORD_BY_ID = 'getKeywordById',
  RESET_COUNT_BY_USER_SESSION_ID = 'resetCountByUserSessionId',
  INCREASE_KEYWORD_COUNT_BY_ID = 'increaseKeywordCountById',
  GET_KEYWORDS_BY_USER_SESSION_ID = 'getKeywordsByUserSessionId',
  FIND_KEYWORD_BY_USER_SESSION_ID_AND_MESSAGE = 'findKeywordByUserSessionIdAndMessage',
  FIND_KEYWORD_BY_USER_SESSION = 'findKeywordByUserSession',
}

export enum AdminMethodNames {
  CREATE_ADMIN = 'createAdmin',
  FIND_ONE_BY_EMAIL = 'findOneByEmail',
}

export enum CalculatedStatMethodNames {
  GET_CALCULATED_STATS = 'getCalculatedStats',
  CREATE_CALCULATED_STATS = 'createCalculatedStats',
}

export enum CronMethodNames {
  GET_CRON_JOBS = 'getCronJobs',
  GET_CRON_JOB_BY_NAME_AND_TIME = 'getCronJobByNameAndTime',
  GET_CRON_JOB_BY_ID = 'getCronJobById',
  CREATE_CRON_JOB = 'createCronJob',
  UPDATE_CRON_JOB = 'updateCronJob',
  DELETE_CRON_JOB = 'deleteCronJob',
}

export enum PersonalInfoMethodNames {
  UPDATE_PERSONAL_INFO = 'updatePersonalInfo',
  GET_BY_USER_ID = 'getByUserId',
  DELETE_PERSONAL_INFO_BY_ID = 'deletePersonalInfoById',
}

export enum StatsMethodNames {
  CREATE_STATS = 'createStats',
  UPDATE_STATS_BY_API_ID = 'updateStatsByApiId',
  INCREASE_INCOMING_MESSAGES_COUNT = 'increaseIncomingMessagesCountToSessionByApiId',
  INCREASE_OUTGOING_MESSAGES_COUNT = 'increaseOutgoingMessagesCountToSessionByApiId',
  GET_STATS_BY_API_ID = 'getStatsByApiId',
}

export enum UserMethodNames {
  FIND_USER_BY_API_ID_AND_TELEGRAM_ID = 'findUserByApiIdAndTelegramId',
  CREATE_USER = 'createUser',
  GET_COUNT_USERS_BY_API_ID = 'getCountUsersByApiId',
  CLEAN_TABLE_BY_API_ID = 'cleanTableByApiId',
}

export enum UserSessionMethodNames {
  GET_USER_SESSIONS = 'getUserSessions',
  GET_PERSONAL_INFO_BY_TELEGRAM_ID = 'getPersonalInfoByTelegramId',
  GET_PERSONAL_INFO_BY_API_ID = 'getPersonalInfoByApiId',
  GET_USER_SESSION_BY_ID = 'getUserSessionById',
  GET_USER_SESSION_BY_TELEGRAM_ID = 'getUserSessionByTelegramId',
  GET_USER_SESSION_BY_API_ID = 'getUserSessionByApiId',
  UPDATE_USER_SESSION_BY_TELEGRAM_ID = 'updateUserSessionByTelegramId',
  UPDATE_API_INFO_BY_TELEGRAM_ID = 'updateApiInfoByTelegramId',
  GET_ACTIVE_USER_SESSIONS = 'getActiveUserSessions',
  CREATE_USER_SESSION_TRANSACTION = 'createUserSessionTransaction',
}
