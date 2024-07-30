export enum MetricNames {
  DB_REQUEST_KEYWORDS_TOTAL = 'db_request_keywords_total',
  DB_REQUEST_KEYWORDS_GAUGE = 'db_request_keywords_gauge',
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
  DB_REQUEST_KEYWORDS_TOTAL = 'Total number of database requests for keywords',
  DB_REQUEST_KEYWORDS_GAUGE = 'Gauge of database keywords requests',
  DB_REQUEST_PERSONAL_INFO_TOTAL = 'Total number of database requests for personal info',
  DB_REQUEST_ADMINS_TOTAL = 'Total number of database requests for admins',
  DB_REQUEST_CALCULATED_STATS_TOTAL = 'Total number of database requests for calculated stats',
  DB_REQUEST_CRON_TOTAL = 'Total number of database requests for cron jobs',
  DB_REQUEST_STATS_TOTAL = 'Total number of database requests for stats',
  DB_REQUEST_USERS_TOTAL = 'Total number of database requests for users',
  DB_REQUEST_USER_SESSION_TOTAL = 'Total number of database requests for user sessions',
}
