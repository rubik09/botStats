import { setupSteps } from './consts';
import { Keyword } from '../keywords/entity/keywords.entity';
import { CreateTelegramConnectionDto } from '../telegramConnect/dto/createTelegramConnect.dto';

export type TSetupSteps = {
  [key in setupSteps]: (createTelegramConnectionDto: CreateTelegramConnectionDto) => Promise<void>;
};

export type TUniqueActivities = {
  [key: string]: { activity: string; count: number; keywords: TKeyword[] };
};

export type TKeyword = {
  keyword: string;
  count: number;
};

export type TToken = { token: string };

export type TPayload = { email: string };
