import {TelegramClient} from "telegram";

export interface TClients {
    [userId: number]: TelegramClient;
}


export interface TClientStartPromises {
    [userId: number]: Promise<any>;
}

export interface TPromises {
    [userId: number]: {
        resolve: (value: TPromiseValue ) => void;
        promise: Promise<TPromiseValue >;
    };
}

export interface TPromiseValue {
    accountPassword: string;
    phoneCode: string
}
