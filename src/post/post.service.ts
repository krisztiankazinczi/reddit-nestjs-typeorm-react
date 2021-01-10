import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  createPost(createPostDto: CreatePostDto) {
    return this.postRepository.create(createPostDto);
  }

  savePost(post: Post) {
    post.makeIdAndSlug();
    return this.postRepository.save(post);
  }

  findAll() {
    // the same options can be used as in case of normal TypeORM Entity
    return this.postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['sub', 'comments', 'votes'],
    });
  }

  findPost(identifier: string, slug: string, relations) {
    return this.postRepository.findOneOrFail(
      { identifier, slug },
      { relations },
    );
  }

  findPostWithQuery(query) {
    return this.postRepository.find(query);
  }

  findPostsByUser(user: User) {
    return this.postRepository.find({
      where: { user },
      relations: ['comments', 'votes', 'sub'],
    });
  }

  createComment(createCommentDto: CreateCommentDto) {
    return this.commentRepository.create(createCommentDto);
  }

  saveComment(comment: Comment) {
    comment.makeIdAndSlug();
    return this.commentRepository.save(comment);
  }

  findComment(identifier: string) {
    return this.commentRepository.findOneOrFail({ identifier });
  }

  findCommentsOnPost(condition: {
    where: { post: Post };
    order: { [key: string]: 'DESC' | 'ASC' };
    relations: string[] | [];
  }) {
    return this.commentRepository.find(condition);
  }

  findCommentsByUser(user: User) {
    return this.commentRepository.find({
      where: { user },
      relations: ['post'],
    });
  }

  setUserVote(post: Post, user: User) {
    post.setUserVote(user);
    return post;
  }

  setUserVotesOnPosts(posts: Post[], user: User) {
    posts.forEach((p) => p.setUserVote(user));
    return posts;
  }

  setUserVotesOnComments(comments: Comment[], user: User) {
    comments.forEach((c) => c.setUserVote(user));
    return comments;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
