import { setupSteps } from './consts';
import { Keyword } from '../keywords/entity/keywords.entity';
import { CreateTelegramConnectionDto } from '../telegramConnect/dto/createTelegramConnect.dto';

export type TSetupSteps = {
  [key in setupSteps]: (createTelegramConnectionDto: CreateTelegramConnectionDto) => Promise<void>;
};

export type TUniqueActivities = {
  [key: string]: Keyword;
};

export type TToken = { token: string };

export type TTokenRole = { token: string, adminRoles: number };

export type TPayload = { email: string };
