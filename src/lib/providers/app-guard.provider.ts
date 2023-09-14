import { Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthGuard } from '@/lib/guards/auth.guard';

export const AppGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};
