import { configService } from '@/lib/services/env.service';

export const jwtConfig = {
  global: true,
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: '1d' },
};
