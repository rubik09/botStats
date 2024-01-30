import {TelegramClient} from "telegram";

export interface Clients {
    [userId: string]: TelegramClient;
}

export type ClientType = {
    name?: string;
    session: string;
};

export interface ClientStartPromises {
    [userId: string]: Promise<any>;
}

export interface Promises {
    [userId: string]: {
        resolve: (value: { accountPassword: string; phoneCode: string }) => void;
        promise: Promise<{ accountPassword: string; phoneCode: string }>;
    };
}
