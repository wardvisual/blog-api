import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@/lib/decorators/public.decorator';
import { BaseController } from '@/lib/controllers/base.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Public()
  @Post('login')
  signIn(@Body() user: LoginDto) {
    return this.authService.signIn(user);
  }

  @Public()
  @Post('register')
  signUp(@Body() user: RegisterDto) {
    return this.authService.signUp(user);
  }
}
