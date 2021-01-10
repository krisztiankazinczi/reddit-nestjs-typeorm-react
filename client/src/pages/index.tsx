import Head from 'next/head';
import { Fragment} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR from 'swr'
import Image from 'next/image';

import PostCard from '../components/PostCard';

import { Post, Sub } from '../types';
import Link from 'next/link';
 
dayjs.extend(relativeTime);

export default function Home() {
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get('/posts')
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);
// ez egyenerteku a kikommentelt resszel!!
  const { data: posts } = useSWR('/posts');
  const { data: topSubs } = useSWR('/misc/top-subs');

  return (
    // ez a padding azert kell ,ert pont 20 egyseg magas a navbar!!!!
    <Fragment>
      <Head>
        <title>Reddit: the front page of internet</title>
      </Head>

      <div className="container flex pt-4">
        <div className="w-160">
          {/* Post feed */}
          {posts?.map((post: Post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => (
                <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                    <Link href={`/r/${sub.name}`}>
                      <Image 
                        className="rounded-full cursor-pointer"
                        src={sub.imageUrl} 
                        alt="Sub" 
                        width={6 * 16 /4} 
                        height={6 * 16 /4} 
                      />
                    </Link>
                    <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold  hover:cursor-pointer">
                        /r/{sub.name}
                      </a>
                    </Link>
                    <p className="ml-auto font-med">{sub.postCount}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </Fragment>
  );
}

// Server side renderinggel is fetchelhetunk. Ilyenkor oldal betoltes elott lefetcheli serveren a dolgokat es utana rendereli ki a clientnek
// import { GetServerSideProps } from 'next'
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts')

//     return { props: { posts: res.data }}
//   } catch (error) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }
// propsba atpasszolhatjuk a resultot, destructuraljuk a componentben es ennyi
