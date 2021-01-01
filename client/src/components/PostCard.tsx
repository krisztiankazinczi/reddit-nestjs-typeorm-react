import Link from 'next/link';
import { Post } from '../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Axios from 'axios';
import classNames from 'classnames';
import ActionButton from './ActionButton';
dayjs.extend(relativeTime);

interface Props {
  post: Post;
}

function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    voteScore,
    createdAt,
    userVote,
    commentCount,
    url,
    username,
  },
}: Props) {
  
  const vote = async (value: number) => {
    try {
      const res = await Axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* Vote Section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* Upvote and DownVote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-blue-600': userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-red-500': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
              <img
                src="https://i.stack.imgur.com/SE2cv.jpg"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              /r/{subName}
            </a>
          </Link>

          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
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
