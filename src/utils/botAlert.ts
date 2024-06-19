import * as TelegramBot from 'node-telegram-bot-api';

import config from '../configuration/config';

const { BOT_TOKEN_ALERT } = config();
const botAlert = new TelegramBot(BOT_TOKEN_ALERT);

export default botAlert;
