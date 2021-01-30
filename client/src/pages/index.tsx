import Head from 'next/head';
import { Fragment, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR, { useSWRInfinite } from 'swr'
import Image from 'next/image';

import PostCard from '../components/PostCard';

import { Post, Sub } from '../types';
import Link from 'next/link';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
 
dayjs.extend(relativeTime);

export default function Home() {
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get('/posts')
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);
// ez egyenerteku a kikommentelt resszel!!

  const [observedPost, setObservedPost] = useState('');

  // const { data: posts } = useSWR<Post[]>('/posts');
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');
  const { authenticated } = useAuthState();

  // isValidating true when we are fetching data!!!!
  const { data, error, mutate, size: page, setSize: setPage, isValidating, revalidate } = useSWRInfinite<Post[]>(
    index => 
      `/posts?page=${index}`
  );

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || !posts.length) return;
    const id = posts[posts.length -1].identifier;
    if (id !== observedPost) { // if this id has not changed, we know that we reached the bottom of all the posts
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return; // html element not rendered yet
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === true) {
        setPage(page + 1);
        observer.unobserve(element); // always unobserve the bottom element when we reach them
      }
    }, {threshold: 1}); // threshold 1 - we track the bottom, 0 - we track the top!!!!
    observer.observe(element);
  }

  return (
    // ez a padding azert kell ,ert pont 20 egyseg magas a navbar!!!!
    <Fragment>
      <Head>
        <title>Reddit: the front page of internet</title>
      </Head>

      <div className="container flex pt-4">
          {/* Post feed */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="text-lg text-center">Loading...</p>} {/**first loading */}
          {posts?.map((post: Post) => (
            <PostCard post={post} key={post.identifier} revalidate={revalidate} />
            ))}
          {isValidating && posts.length && <p className="text-lg text-center">Loading More...</p>}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                    <Link href={`/r/${sub.name}`}>
                      <a>
                        <Image 
                          className="rounded-full cursor-pointer"
                          src={sub.imageUrl} 
                          alt="Sub" 
                          width={6 * 16 /4} 
                          height={6 * 16 /4} 
                        />
                      </a>
                    </Link>
                    <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold hover:cursor-pointer">
                        /r/{sub.name}
                      </a>
                    </Link>
                    <p className="ml-auto font-med">{sub.postCount}</p>
                  </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
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
