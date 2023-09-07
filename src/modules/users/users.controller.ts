import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { BaseController } from '@/lib/controllers/base.controller';

@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post()
  create(@Body() user: CreateUserDto, @Res() response: Response) {
    const result = this.usersService.create(user);
    return this.send(result, response);
  }

  @Get()
  findAll(@Res() response: Response) {
    const result = this.usersService.findAll();
    return this.send(result, response);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() response: Response) {
    const result = this.usersService.findOne(id);
    return this.send(result, response);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const result = this.usersService.update(id, updateUserDto);
    return this.send(result, response);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    const result = this.usersService.remove(id);
    return this.send(result, response);
  }
}
