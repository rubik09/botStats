import * as dotenv from 'dotenv';

dotenv.config();

export const setupSteps = {
    firstStep: 1,
    secondStep: 2,
    thirdStep: 3
}

export const {TABLE_LINK, SPREADSHEET_ID, SHEET_ID} = process.env;

export interface Clients {
    [userId: string]: ClientType;
}

export type ClientType = {
    name?: string;
    session: {
        save(): void;
    };
};

export interface ClientStartPromises {
    [userId: string]: Promise<any>;
}

export interface Promises {
    [userId: string]: {
        resolve: (value: { account_password: string; phoneCode: number }) => void;
        promise: Promise<{ account_password: string; phoneCode: number }>;
    };
}
