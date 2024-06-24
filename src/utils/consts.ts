export const enum setupSteps {
  FIRST_STEP = 1,
  SECOND_STEP = 2,
  THIRD_STEP = 3,
}

export const cronTimezone = 'Europe/Moscow';

export const MESSAGES_CONNECTION_CLOSED = ['The server closed the connection while sending'];

export const createCLientConfig = {
  CONNECTION_RETRIES: 5,
  SEQUENTIAL_UPDATES: true,
  FLOOD_SLEEP_THRESHOLD: 300,
};
