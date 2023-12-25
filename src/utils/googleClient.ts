import { google, sheets_v4 } from 'googleapis';

export const auth = new google.auth.GoogleAuth({
    keyFile: 'src/utils/google.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

export const googleSheets = async (): Promise<sheets_v4.Sheets> => {
    const client = await auth.getClient();

    return google.sheets({ version: 'v4', auth: client as any }) as sheets_v4.Sheets;
};
