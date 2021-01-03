import Axios from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';
import { Comment, Post } from '../types';

interface Props {
  post: Post;
  comment?: Comment;
  identifier: string | string[] | undefined;
  slug: string | string[] | undefined;
}

const Vote: React.FC<Props> = ({ post, comment, identifier, slug }) => {
  const { authenticated } = useAuthState();
  const router = useRouter();


  const vote = async (value: number, comm?: Comment) => {
    // if not logged in redirect to login
    if (!authenticated) router.push('/login');
    console.log(comm)
    console.log(post)
    console.log(identifier)
    console.log(slug)
    console.log(value)
    // if vote value is the same as it was then set uservote to 0, and back-end will delete the vote from database
    if (
      (!comm && value === post?.userVote) || 
      (comm && comm.userVote === value)
    ) value = 0;
    
    try {
      await Axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comm?.identifier, // if it's undefined, this commentIdentifier wont be sent to server!!!
        value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // Vote Section
    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
      {/* Upvote and DownVote */}
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        onClick={comment ? () => vote(1, comment) : () => vote(1)}
      >
        <i
          className={classNames('icon-arrow-up', {
            'text-blue-600': comment ? comment.userVote === 1 : post.userVote === 1,
          })}
        ></i>
      </div>
      <p className="text-xs font-bold">{comment ? comment.voteScore : post.voteScore}</p>
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
        onClick={comment ? () => vote(-1, comment) : () => vote(-1)}
      >
        <i
          className={classNames('icon-arrow-down', {
            'text-red-500': comment ? comment.userVote === -1 : post.userVote === -1,
          })}
        ></i>
      </div>
    </div>
    );
};

export default Vote;