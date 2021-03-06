import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import Sidebar from "../../../components/Sidebar";
import { useAuthState } from "../../../context/auth";
import { Post, Sub } from "../../../types";

const titleMeta = "Submit to Reddit";
const description = "Submit new post to Reddit";

export default function submit() {
  const router = useRouter();
  const { sub: subName } = router.query;
  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { authenticated } = useAuthState();

  if (!authenticated) router.push('/login');

  if (error) router.push('/');

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') return;

    try {
      const { data: post } = await Axios.post<Post>('/posts', { title: title.trim(), body, subName});

      if (sub) router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container flex pt-5">
      <div className="w-160">
        <Head>
          <title>{titleMeta}</title>  
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="og:title" content={titleMeta} />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:title" content={titleMeta} />
        </Head>
        <div className="w-160">
          <div className="p-4 bg-white rounded">
            <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
            <form onSubmit={submitPost}>
              <div className="relative mb-2">
                <input 
                  type="text" 
                  className="w-5/6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                  placeholder="Title"
                  maxLength={300}
                  value={title}
                  onChange={e => setTitle(e.target.value)}  
                />
                <div 
                  className="absolute mb-2 text-sm text-gray-500 select-none"
                  style={{ top: 11, right: 10 }}>
                  {title.trim().length}/300
                </div>
                <textarea 
                  className="w-full p-3 mt-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Text (optional)"  
                ></textarea>
                <div className="flex justify-end">
                  <button 
                    className="px-3 py-1 blue button" 
                    type="submit"
                    disabled={title.trim().length === 0}  
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {sub && <Sidebar sub={sub!} />}      
    </div>
  )
}

// check if user logged in in server side (rendering)
// export const getServerSideProps: GetServerSideProps =async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;
//     // throw an error if user is not logged in and redirect in the catch
//     if (!cookie) throw new Error('Missing auth token cookie')

//     await Axios.get('/auth/me', { headers: { cookie } });

//     return { props: {}};
//   } catch (error) {
//     res.writeHead(307, { location: '/login' }).end()
//   }
// }
