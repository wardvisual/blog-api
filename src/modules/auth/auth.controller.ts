import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

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
  signIn(@Body() user: LoginDto, @Res() response: Response) {
    const result = this.authService.signIn(user.username, user.password);
    return this.send(result, response);
  }

  @Public()
  @Post('register')
  signUp(@Body() user: RegisterDto, @Res() response: Response) {
    const result = this.authService.signUp(user);
    return this.send(result, response);
  }
}
