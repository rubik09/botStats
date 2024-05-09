import * as process from 'process';

import * as dotenv from 'dotenv';

dotenv.config();

export const { SECRET_JWT, HASHED_PASSWORD } = process.env;
