import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SubService } from 'src/sub/sub.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('api/posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(forwardRef(() => SubService))
    private readonly subService: SubService,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Res() res) {
    const user = res.locals.user;

    try {
      const subRecord = await this.subService.findOneOrFail({
        name: createPostDto.subName,
      });
      createPostDto.user = user;
      createPostDto.sub = subRecord;

      let post = this.postService.createPost(createPostDto);
      post = await this.postService.savePost(post);
      return res.json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      let posts = await this.postService.findAll();
      if (res.locals.user) {
        posts = this.postService.setUserVotesOnPosts(posts, res.locals.user);
      }
      return res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get(':identifier/:slug')
  async findPost(@Param() params, @Res() res) {
    const { identifier, slug } = params;
    try {
      const post = await this.postService.findPost(identifier, slug, [
        'sub',
        'comments',
        'votes',
      ]);
      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Post not found' });
    }
  }

  @Post(':identifier/:slug/comments')
  async commentOnPost(
    @Param() params,
    @Body() createCommentDto: CreateCommentDto,
    @Res() res,
  ) {
    const { identifier, slug } = params;
    try {
      const post = await this.postService.findPost(identifier, slug, [
        'sub',
        'comments',
        'votes',
      ]);
      createCommentDto.user = res.locals.user;
      createCommentDto.post = post;
      let comment = this.postService.createComment(createCommentDto);
      comment = await this.postService.saveComment(comment);
      return res.status(200).json(comment);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Post not found' });
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
