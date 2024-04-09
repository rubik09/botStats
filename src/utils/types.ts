import { setupSteps } from './consts';
import { CreateTelegramConnectionDto } from '../telegramConnect/dto/createTelegramConnect.dto';
import {Keyword} from "../keywords/entity/keywords.entity";
import { Admin } from '../admins/entity/admins.entity';

export type TSetupSteps = {
  [key in setupSteps]: (createTelegramConnectionDto: CreateTelegramConnectionDto) => Promise<void>;
};

export type TUniqueActivities = {
  [key: string]: Keyword;
};

export type TAdminEmailAndPassword = {
  email: Admin['email'],
  password: Admin['password'],
};

