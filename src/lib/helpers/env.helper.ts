import 'dotenv/config';

import { ConfigService } from '@nestjs/config';

export const configService: ConfigService = new ConfigService(process.env);
