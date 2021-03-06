export type Post = {
  identifier: string;
  title: string;
  body?: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  sub?: Sub;
  // virtual fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  imageUrn?: string | null;
  imageUrl?: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  // Virtual fields
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export type Comment = {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  username: string;
  voteScore: number;
  userVote: number;
  post?: Post;
  url?: string;
  subName?: string;
}