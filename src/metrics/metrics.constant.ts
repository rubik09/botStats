export enum MetricNames {
  DB_REQUEST_KEYWORDS_TOTAL = 'db_request_keywords_total',
  DB_REQUEST_PERSONAL_INFO_TOTAL = 'db_request_personalInfo_total',
  DB_REQUEST_ADMINS_TOTAL = 'db_request_admins_total',
  DB_REQUEST_CALCULATED_STATS_TOTAL = 'db_request_calculatedStats_total',
  DB_REQUEST_CRON_TOTAL = 'db_request_cron_total',
  DB_REQUEST_STATS_TOTAL = 'db_request_stats_total',
  DB_REQUEST_USERS_TOTAL = 'db_request_users_total',
  DB_REQUEST_USER_SESSION_TOTAL = 'db_request_userSession_total',
}

export enum MetricLabels {
  METHOD = 'method',
  ROUTE = 'route',
  STATUS_CODE = 'status_code',
}

export enum MetricHelp {
  DB_REQUEST_KEYWORDS_TOTAL_HELP = 'Total number of database requests for keywords',
  DB_REQUEST_PERSONAL_INFO_TOTAL_HELP = 'Total number of database requests for personal info',
  DB_REQUEST_ADMINS_TOTAL_HELP = 'Total number of database requests for admins',
  DB_REQUEST_CALCULATED_STATS_TOTAL_HELP = 'Total number of database requests for calculated stats',
  DB_REQUEST_CRON_TOTAL_HELP = 'Total number of database requests for cron jobs',
  DB_REQUEST_STATS_TOTAL_HELP = 'Total number of database requests for stats',
  DB_REQUEST_USERS_TOTAL_HELP = 'Total number of database requests for users',
  DB_REQUEST_USER_SESSION_TOTAL_HELP = 'Total number of database requests for user sessions',
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
