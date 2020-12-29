import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR from 'swr'

import PostCard from '../components/PostCard';

import { Post } from '../types';
 
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

  return (
    // ez a padding azert kell ,ert pont 20 egyseg magas a navbar!!!!
    <Fragment>
      <Head>
        <title>Reddit: the front page of internet</title>
      </Head>

      <div className="container flex pt-4">
        <div className="w-160">
          {/* Post feed */}
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
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
