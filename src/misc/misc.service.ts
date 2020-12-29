import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/post/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';

@Injectable()
export class MiscService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  findCommentVote(user: User, comment: Comment) {
    return this.voteRepository.findOne({ user, comment });
  }

  findPostVote(user: User, post: Post) {
    return this.voteRepository.findOne({ user, post });
  }

  createVote(user: User, value: number) {
    return this.voteRepository.create({ user, value });
  }

  saveVote(vote: Vote) {
    return this.voteRepository.save(vote);
  }

  removeVote(vote: Vote) {
    return this.voteRepository.remove(vote);
  }
}
