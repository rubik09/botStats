import {TelegramClient} from "telegram";

export interface IClients {
    [userId: number]: TelegramClient;
}


export interface IClientStartPromises {
    [userId: number]: Promise<any>;
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
