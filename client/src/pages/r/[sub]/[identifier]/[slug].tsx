import Axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import useSWR from "swr";
import Sidebar from "../../../../components/Sidebar";
import { Post, Comment } from "../../../../types";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from "../../../../context/auth";
import ActionButton from "../../../../components/ActionButton";
import { FormEvent, useEffect,  useState } from "react";
import Vote from "../../../../components/Vote";

dayjs.extend(relativeTime);


export default function PostPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();

  const [newComment, setNewComment] = useState('');
  const [description, setDescription] = useState('');

  const { data: post, error, revalidate: revalidatePost } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : ''
  );

  const { data: comments, revalidate: revalidateComment } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : ''
  );
  if (error) router.push('/');

  useEffect(() => {
    if (!post) return;
    let desc = post.body || post.title;
    desc = desc.substring(0, 158).concat('..'); // this is suggested, the description meta should be 150-160 character
    setDescription(desc);
  }, [post]);

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === '') return;
    try {
      if (post) {
        await Axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
          body: newComment
        });
        setNewComment('');
        revalidatePost();
        revalidateComment();
      }
    } catch (error) {
      
    }
  }
console.log(user)
  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && post.sub && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image 
                    src={post.sub.imageUrl!}
                    height={8 * 16 / 4}
                    width={8 * 16 / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">
                /r/{sub}
              </p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        <div className="w-full px-4 md:w-160 md:p-0">
          <div className="bg-white rounded">
            <>
              {post && (
                <div className="flex">
                  <Vote post={post} identifier={identifier} slug={slug} revalidate={revalidatePost} />
                  <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">
                      Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className="mx-1 hover:underline">/u/{post.username}</a>
                      </Link>
                      <Link href={post.url}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>
                  {/* Post Title */}
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  {/* Post Body */}
                  <p className="my-3 text-sm">
                    {post.body}
                  </p>
                  {/* Actions */}
                  <div className="flex">
                    <Link href={post.url}>
                      <a>
                        <ActionButton>
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">{post.commentCount} Comments</span>
                        </ActionButton>
                      </a>
                    </Link>
                    <ActionButton>
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </ActionButton>
                    <ActionButton>
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Save</span>
                    </ActionButton>
                  </div>
                  </div>
                </div>
              )}
              {/* Comment input area */}
              <div className="flex">
              <div className="flex-shrink-0 w-10 py-2 mr-2 text-center bg-gray-200" />
                <div className="w-full my-2 mr-3">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as 
                        <Link href={`/u/${user?.username}`}>
                          <a className="text-blue-500 font-semi-bold">{` ${user?.username}`}</a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea 
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600" 
                          onChange={ e => setNewComment(e.target.value)} 
                          value={newComment}>
                        </textarea>
                        
                        <div className="flex justify-end">
                          <button className="px-3 py-1 blue button" disabled={newComment.trim() === ''}>Comment</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-500">
                      <p className="text-gray-400 font-semi-bold">Log in or sign up to leave a comment</p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">Login</a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Comments list */}
              <hr />
              {post && comments?.map(comment => (
                <div className="flex" key={comment.identifier}>
                  <Vote post={post} comment={comment} identifier={identifier} slug={slug} revalidate={revalidateComment} />
                  <div className="py-2 pr-2">
                    <p className="mb-1 text-xs leading-none">
                      <Link href={`/u/${comment.username}`}>
                        <a className="mr-1 font-bold hover:underline">
                          {comment.username}
                        </a>
                      </Link>
                      <span className="text-gray-600">
                        {`${comment.voteScore} points • ${dayjs(comment.createdAt).fromNow()}`}
                      </span>
                    </p>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
            </>
          </div>
        </div>
        {post && <Sidebar sub={post.sub!} />}
      </div>
    </>
  )
}
