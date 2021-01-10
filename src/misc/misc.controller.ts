import { Body, Controller, Res, Post, Get, Param } from '@nestjs/common';
import { MiscService } from './misc.service';
import { VoteBodyDto } from './dto/vote-body.dto';
import User from 'src/user/entities/user.entity';
import { PostService } from 'src/post/post.service';
import { SubService } from 'src/sub/sub.service';
import { Vote } from './entities/vote.entity';
import { Comment } from 'src/post/entities/comment.entity';
import { UserService } from 'src/user/user.service';

@Controller('api/misc')
export class MiscController {
  constructor(
    private readonly miscService: MiscService,
    private readonly postService: PostService,
    private readonly subService: SubService,
    private readonly userService: UserService,
  ) {}

  @Post('vote')
  async vote(@Body() voteBodyDto: VoteBodyDto, @Res() res) {
    const user: User = res.locals.user;
    try {
      let post = await this.postService.findPost(
        voteBodyDto.identifier,
        voteBodyDto.slug,
        ['sub', 'comments', 'votes'],
      );
      let vote: Vote | undefined;
      let comment: Comment | undefined;

      if (voteBodyDto.commentIdentifier) {
        comment = await this.postService.findComment(
          voteBodyDto.commentIdentifier,
        );
        vote = await this.miscService.findCommentVote(user, comment);
      } else {
        vote = await this.miscService.findPostVote(user, post);
      }

      if (!vote && voteBodyDto.value === 0) {
        // value 0 means want to delete my vote
        // if no vote and value == 0 return error
        return res.status(404).json({ error: 'Vote not found' });
      } else if (!vote) {
        vote = this.miscService.createVote(user, voteBodyDto.value);
        if (comment) {
          // * if it's a comment vote, comment added to vode
          vote.comment = comment;
        } else {
          // * if it's a post vote, post added to vode
          vote.post = post;
        }

        await this.miscService.saveVote(vote);
      } else if (voteBodyDto.value === 0) {
        // vote exists, and value = 0, remove vote from db
        await this.miscService.removeVote(vote);
      } else if (vote.value !== voteBodyDto.value) {
        vote.value = voteBodyDto.value;
        await this.miscService.saveVote(vote);
      }

      post = await this.postService.findPost(
        voteBodyDto.identifier,
        voteBodyDto.slug,
        ['comments', 'comments.votes', 'sub', 'votes'],
      );

      post.setUserVote(user);
      const postComments = this.postService.setUserVotesOnComments(
        post.comments,
        user,
      );
      post.comments = postComments;
      return res.json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    return res.status(200).json(voteBodyDto);
  }

  @Get('top-subs')
  async topSubs(@Res() res) {
    try {
      const subs = await this.subService.getTopSubs();
      return res.json(subs);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  @Get('users/:username')
  async getUserSubmissions(@Param() param, @Res() res) {
    try {
      const user = await this.userService.getUserSubmissions(param.username);
      const posts = await this.postService.findPostsByUser(user);
      const comments = await this.postService.findCommentsByUser(user);

      if (res.locals.user) {
        this.postService.setUserVotesOnPosts(posts, user);
        this.postService.setUserVotesOnComments(comments, user);
      }

      const submissions: any[] = [];
      // ...p.toJSON() - hasznaljuk, mert rengeteg adat lehet benne!!!!!
      posts.forEach((p) => submissions.push({ type: 'Post', ...p.toJSON() }));
      posts.forEach((c) =>
        submissions.push({ type: 'Comment', ...c.toJSON() }),
      );

      submissions.sort((a, b) => {
        if (b.createdAt > a.createdAt) return 1;
        if (b.createdAt < a.createdAt) return -1;
        return 0;
      });

      return res.json({ user, submissions });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}
