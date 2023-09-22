import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@/lib/decorators/public.decorator';
import { BaseController } from '@/lib/controllers/base.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('authentication')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Public()
  @Post('login')
  signIn(@Body() user: LoginDto) {
    return this.authService.signIn(user);
  }

  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Public()
  @Post('register')
  signUp(@Body() user: RegisterDto) {
    return this.authService.signUp(user);
  }
}
