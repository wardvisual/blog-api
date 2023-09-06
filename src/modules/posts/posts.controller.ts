import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { multerOptions } from '@/lib/config/multer.config';
import { BaseController } from '@/lib/controllers/base.controller';

@Controller('posts')
export class PostsController extends BaseController {
  constructor(private readonly postsService: PostsService) {
    super()
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@UploadedFile() { filename }: Express.Multer.File, @Body() post: CreatePostDto, @Res() response: Response) {
    const result = this.postsService.create({ image: filename, ...post });
    return this.send(result, response);
  }

  @Get()
  findAll(@Res() response: Response) {
    const result = this.postsService.findAll();
    return this.send(result, response);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() response: Response) {
    const result = this.postsService.findOne(id);
    return this.send(result, response);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(@Param('id') id: string, @UploadedFile() { filename }: Express.Multer.File, @Body() post: UpdatePostDto, @Res() response: Response) {
    const result = this.postsService.update(id, { image: filename, ...post });
    return this.send(result, response);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    const result = this.postsService.remove(id);
    return this.send(result, response);
  }
}
