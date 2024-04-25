import * as dotenv from 'dotenv';

dotenv.config();

const { CRON_TIME_NIGHT, CRON_TIME_DAY } = process.env;

export const enum setupSteps {
  FIRST_STEP = 1,
  SECOND_STEP = 2,
  THIRD_STEP = 3,
}

export const time = {
  DAY: '10:00-00:00 - day',
  NIGHT: '00:00-10:00 - night',
};

export const cronTimezone = 'Europe/Moscow';

export const cronTimeDay = CRON_TIME_DAY;
export const cronTimeNight = CRON_TIME_NIGHT;

export const basePage = 1;
export const baseLimit = 30;
