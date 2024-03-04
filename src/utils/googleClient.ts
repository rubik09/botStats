import { google, sheets_v4 } from "googleapis";
import * as dotenv from "dotenv";
import { JWT } from "google-auth-library";

dotenv.config();

const { PRIVATE_KEY, CLIENT_EMAIL } = process.env;

export const googleSheets = async (): Promise<sheets_v4.Sheets> => {
  try {
    const jwtClient = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY.split(String.raw`\n`).join("\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    await jwtClient.authorize();
    return google.sheets({
      version: "v4",
      auth: jwtClient,
    }) as sheets_v4.Sheets;
  } catch (error) {
    throw error;
  }
};
