import { ConfigService } from '@nestjs/config';

export class EnvHelper {
  private static config: ConfigService;

  constructor(private configService: ConfigService) {
    EnvHelper.config = this.configService;
  }

  static get<T>(name: string): T {
    return this.config.get<T>(name);
  }
}
