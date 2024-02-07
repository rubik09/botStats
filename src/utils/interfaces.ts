import {TelegramClient} from "telegram";
import {UserSession} from "../userSession/entity/userSession.entity";

export interface IClients {
    [userId: number]: TelegramClient;
}


export interface IClientStartPromises {
    [userId: number]: Promise<void>;
}

export interface IPromises {
    [userId: number]: {
        resolve: (value: IPromiseValue ) => void;
        promise: Promise<IPromiseValue >;
    };
}

export interface IPromiseValue {
    accountPassword: string;
    phoneCode: string
}

export interface IFirstStep  {
    apiId: UserSession['apiId'],
    apiHash: UserSession['apiHash'],
    telegramId: UserSession['telegramId']
}

export interface ISecondStep  {
    accountPassword: string
    code: string,
    telegramId: UserSession['telegramId']
}

export interface IThirdStep  {
    keywords: UserSession['keywords'],
    telegramId: UserSession['telegramId']
}

export interface ICreateClient  {
    logSession: UserSession['logSession'],
    apiId: UserSession['apiId'],
    apiHash: UserSession['apiHash'],
}

export interface ITelegramInit  {
    logSession: UserSession["logSession"],
    apiId: UserSession["apiId"],
    apiHash: UserSession["apiHash"],
    telegramId: UserSession["telegramId"],
}
