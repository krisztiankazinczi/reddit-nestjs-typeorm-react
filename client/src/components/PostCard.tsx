import Link from 'next/link';
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ActionButton from './ActionButton';
import Vote from './Vote';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
dayjs.extend(relativeTime);

interface Props {
  post: Post;
  revalidate?: Function
}

function PostCard({
  post,
  revalidate
}: Props) {

  const router = useRouter();

  const isInSubPage = router.pathname === '/r/[sub]';
  
  return (
    <div key={post.identifier} className="flex mb-4 bg-white rounded" id={post.identifier}>
      {/* Vote Section */}
      <Vote post={post} identifier={post.identifier} slug={post.slug} revalidate={revalidate}  />
      {/* Post data section */}
      <div className="w-full py-2 pr-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <>
              <Link href={`/r/${post.subName}`}>
                  <img
                    src={post?.sub?.imageUrl}
                    className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                  />
              </Link>
              <Link href={`/r/${post.subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{post.subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-500">•</span>
            </>
          )}

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
        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm">{post.body}</p>}

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
  );
}

export default PostCard;
