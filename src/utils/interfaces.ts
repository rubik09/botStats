import { ExecutionContext } from '@nestjs/common';
import { TelegramClient } from 'telegram';

export interface IClients {
  [userId: number]: TelegramClient;
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

export interface CalculatedActivityKeywords {
  activity: string;
  count: number;
}

export interface ITelegramMessage {
  chat_id: number;
  text: string;
}

export interface IMetricsRecordParams {
  context: ExecutionContext;
  method: string;
  route: string;
  startTime: number;
}

export interface ICounterMetricConfig {
  name: string;
  help: string;
  labelNames: string[];
}

export interface IHistogramMetricConfig extends ICounterMetricConfig {
  buckets: number[];
}