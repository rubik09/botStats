import { TelegramClient } from 'telegram';

import { PersonalInfo } from '../personalInfo/entity/personalInfo.entity';
import { UserSession } from '../userSession/entity/userSession.entity';
import {Keywords} from "../keywords/entity/keywords.entity";

export interface IClients {
  [userId: number]: TelegramClient;
}

export interface IClientStartPromises {
  [userId: number]: Promise<void>;
}

export interface IPromises {
  [userId: number]: {
    resolve: (value: IPromiseValue) => void;
    promise: Promise<IPromiseValue>;
  };
}

export interface IPromiseValue {
  accountPassword: string;
  phoneCode: string;
}

export interface IGeneralStep {
  telegramId: UserSession['telegramId'];
  username: PersonalInfo['username'];
}

export interface IFirstStep extends IGeneralStep {
  apiId: UserSession['apiId'];
  apiHash: UserSession['apiHash'];
  phoneNumber: PersonalInfo['phoneNumber'];
}

export interface ISecondStep extends IGeneralStep {
  accountPassword: string;
  code: string;
}

export interface IThirdStep extends IGeneralStep {
  keyword: Keywords['keyword'],
  activity: Keywords['activity'],
}

export interface ICreateClient {
  logSession: UserSession['logSession'];
  apiId: UserSession['apiId'];
  apiHash: UserSession['apiHash'];
}

export interface ITelegramInit {
  logSession: UserSession['logSession'];
  apiId: UserSession['apiId'];
  apiHash: UserSession['apiHash'];
  telegramId: UserSession['telegramId'];
}
