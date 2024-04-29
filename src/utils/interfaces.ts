import { TelegramClient } from 'telegram';

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

interface IGeneralStep {
  telegramId: number;
  username: string;
}

export interface IFirstStep extends IGeneralStep {
  apiId: number;
  apiHash: string;
  phoneNumber: string;
}

export interface ISecondStep extends IGeneralStep {
  accountPassword: string;
  code: string;
}

export interface IThirdStep extends IGeneralStep {
  keyword: string;
  activity: string;
}

export interface ICreateClient {
  logSession: string;
  apiId: number;
  apiHash: string;
}

export interface ITelegramInit {
  logSession: string;
  apiId: number;
  apiHash: string;
  telegramId: number;
}

//Если нам важно activity и count то предлагаю здесь убрать keyword и назвать примерно CalculatedActivityCount и потом изменить дальше по коду
export interface CalculatedKeywords {
  // keyword: string;
  activity: string;
  count: number;
}
