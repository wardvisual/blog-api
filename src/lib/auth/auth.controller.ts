import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseController } from '../controllers/base.controller';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  signIn(@Body() user: LoginDto, @Res() response: Response) {
    const result = this.authService.signIn(user.username, user.password);
    return this.send(result, response);
  }
}
