export const enum setupSteps {
  FIRST_STEP = 1,
  SECOND_STEP = 2,
  THIRD_STEP = 3,
}

export const cronTimezone = 'Europe/Moscow';

export const MESSAGES_CONNECTION_CLOSED = ['The server closed the connection while sending'];

export const TELEGRAM_BOT_API_URL = 'https://api.telegram.org/bot';

export const CREATE_CLIENT_CONFIG = {
  connectionRetries: 5,
  sequentialUpdates: true,
  floodSleepThreshold: 300,
};
