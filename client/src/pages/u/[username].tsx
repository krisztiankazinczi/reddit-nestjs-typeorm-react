import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router"
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { useAuthState } from "../../context/auth";
import { Comment, Post } from "../../types";

export default function user() {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<any>(username ? `/misc/users/${username}` : null)
  if (error) router.push('/');

  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission: any) => {
              if (submission.type === 'Post') {
                const post: Post = submission;
                return <PostCard key={post.identifier + Math.random() * 10000} post={post} />
              } else {
                const comment: Comment = submission;
                
                return (
                  <div key={comment.identifier + Math.random() * 10000} className="flex mb-4 bg-white rounded">
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                      <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                      </div>
                      <div className="w-full p-2">
                        <p className="mb-2 text-xs text-gray-500">
                            <a className="font-semibold cursor-pointer hover:underline">{comment.username}</a>
                          <span> commented on </span>
                          <span className="mx-1">•</span>
                          {comment?.post && comment?.post?.url && (
                            <Link href={comment.post.url}>
                              <a className="cursor-pointer hover:underline">{comment.post.title}</a>
                            </Link>
                          )}
                          {comment?.subName && (
                            <Link href={`/r/${comment.subName}`}>
                              <a className="text-black cursor-pointer hover:underline">/r/{comment.subName}</a>
                            </Link>
                          )}
                        </p>
                        <hr />
                        <p>{comment.body}</p>
                      </div>
                    
                  </div>
                )
              }
            })}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white rounded">
              <div className="p-3 bg-blue-500 rounded-t">
                <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user profile"
                  className="w-16 h-16 mx-auto border-2 border-white rounded-full"
                />
              </div>
              <div className="p-3">
                <h1 className="mb-3 text-xl text-center">{data.user.username}</h1>
                <hr />
                <p className="mt-3 text-center">Joined {dayjs(data.user.createdAt).format('MMM YYYY')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


