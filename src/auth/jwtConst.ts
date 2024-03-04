import * as dotenv from "dotenv";
import * as process from "process";

dotenv.config();

export const { SECRET_JWT } = process.env;
