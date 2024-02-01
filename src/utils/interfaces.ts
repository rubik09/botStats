import {TelegramClient} from "telegram";
import {setupSteps} from "./consts";
import {CreateTelegramConnectionDto} from "../telegramConnect/dto/createTelegramConnect.dto";

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

export type TSetupSteps = {
    [key in setupSteps]: (createTelegramConnectionDto: CreateTelegramConnectionDto) => Promise<void>;
};
