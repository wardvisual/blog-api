import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { multerOptions } from '@/lib/config/multer.config';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@UploadedFile() { filename }: Express.Multer.File, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create({ image: filename, ...createPostDto });
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
  update(@Param('id') id: string, @UploadedFile() { filename }: Express.Multer.File, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, { image: filename, ...updatePostDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
