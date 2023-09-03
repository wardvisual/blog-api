import { ConfigService } from '@nestjs/config';

export class EnvHelper {
  constructor(private configService: ConfigService) {}

  get<T>(name: string): T {
    return this.configService.get<T>(name);
  }
}
