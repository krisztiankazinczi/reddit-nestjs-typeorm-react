import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  Delete,
  Put,
  Inject,
  forwardRef,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { PostService } from 'src/post/post.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { SubService } from './sub.service';
import { makeId } from '../utils/helpers';
import { Sub } from './entities/sub.entity';
import { ImageUploadDto } from './dto/image-upload.dto';
import fs from 'fs';

@Controller('api/subs')
export class SubController {
  constructor(
    private readonly subService: SubService,
    // circular dependency with PostModule!!!!
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  @Post()
  async create(@Res() res, @Body() createSubDto: CreateSubDto) {
    try {
      const subExist = await this.subService.subExists(createSubDto.name);
      if (subExist) {
        throw new Error('Sub exists already');
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      createSubDto.user = res.locals.user;
      const sub = this.subService.create(createSubDto);
      await this.subService.save(sub);

      return res.status(200).json(sub);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const subs = await this.subService.findAll();
      return res.status(200).json(subs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get(':name')
  async findOne(@Param('name') name: string, @Res() res) {
    try {
      const sub = await this.subService.findOne(name);
      let posts = await this.postService.findPostWithQuery({
        where: { sub },
        order: { createdAt: 'DESC' },
        relations: ['comments', 'votes'],
      });
      if (res.locals.user) {
        posts = this.postService.setUserVotesOnPosts(posts, res.locals.user);
      }

      sub.posts = posts;
      return res.status(200).json(sub);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ sub: 'Sub not found' });
    }
  }

  // file upload a beepitett multerral!!
  @Post(':name/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, callback) => {
          // this code generates a random filename
          const name = makeId(15);
          callback(null, name + path.extname(file.originalname)); //random string + file extension
        },
      }),
      // this middleware will check the type of uploaded files!!!
      fileFilter: (
        req,
        file: any,
        callback: (error: Error, acceptFile: boolean) => void,
      ) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          callback(null, true);
        } else {
          req.fileValidationError = 'Unsupported file type';
          // I don't throw new error here. I will handle this in controller function
          callback(null, false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Req() req,
    @Res() res,
    @Body() imageUploadDto: ImageUploadDto,
  ) {
    const { type } = imageUploadDto;
    // ha a type rossznak volt megadva!!! Akkor torolni kell a filet a szerverrol, mert a multer feltoltotte azt korabban
    // a validation-exceptionsban torlom!!!
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    // own-sub middlewarebol
    const sub: Sub = res.locals.sub;
    try {
      let oldImageUrn = '';

      if (type === 'image') {
        oldImageUrn = sub.imageUrn || '';
        sub.imageUrn = file.filename;
      } else if (type === 'banner') {
        oldImageUrn = sub.bannerUrn || '';
        sub.bannerUrn = file.filename;
      }
      // if we upload a new image, just delete the previous one
      await this.subService.save(sub);

      if (oldImageUrn !== '') {
        fs.unlinkSync(`public/images/${oldImageUrn}`);
      }

      return res.json(sub);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong' });
    }

    return res.status(200).json({ success: true });
  }

  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body() updateSubDto: UpdateSubDto,
    @Res() res,
  ) {
    const sub = await this.subService.subExists(name);
    if (!sub) {
      return res.status(400).json({ errors: 'Sub not found' });
    }
    await this.subService.update(name, updateSubDto);

    return res
      .status(200)
      .json(await this.subService.findOne(updateSubDto?.name || name));
    // if updated name value changes, I want to find the sub with the new name, otherwise the original name
  }

  @Delete(':name')
  async remove(@Param('name') name: string, @Res() res) {
    try {
      const sub = await this.subService.subExists(name);
      if (!sub) {
        return res.status(400).json({ errors: 'Sub not found' });
      }
      this.subService.remove(sub);
      return res.status(200).json({ success: 'Sub successdully removed' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}
