import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { multerOptions } from '@/lib/config/multer.config';
import { BaseController } from '@/lib/controllers/base.controller';

@Controller('posts')
export class PostsController extends BaseController {
  constructor(private readonly postsService: PostsService) {
    super();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() { filename }: Express.Multer.File,
    @Body() post: CreatePostDto,
  ) {
    return this.postsService.create({ image: filename, ...post });
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: string,
    @UploadedFile() { filename }: Express.Multer.File,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.update(id, { image: filename, ...post });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
