import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import Sidebar from "../../../../../components/Sidebar";
import { useAuthState } from "../../../../../context/auth";
import { Post, Sub } from "../../../../../types";

export default function submit() {
  const router = useRouter();
  const { sub: subName, identifier, slug } = router.query;
  const { data: sub, error: subError } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  const { data: post, error: postError } = useSWR<Post>(slug && identifier ? `/posts/${identifier}/${slug}` : null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { authenticated } = useAuthState();

  // if (!authenticated) router.push('/login');

  if (subError && postError) router.push('/');

  useEffect(() => {
    if (!post) return;
    setTitle(post.title);
    if (post?.body) {
      setBody(post.body);
    }
  }, [post])

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') return;

    try {
      const { data: editedPost } = await Axios.put<Post>(`/posts/${identifier}/${slug}`, { title: title.trim(), body, subName});

      if (sub) router.push(`/r/${subName}/${editedPost.identifier}/${editedPost.slug}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container flex pt-5">
      <div className="w-160">
        <Head>
          <title>Edit {post && post.title}</title>  
        </Head>
        <div className="w-160">
          <div className="p-4 bg-white rounded">
            <h1 className="mb-3 text-lg">Edit your post on /r/{subName}</h1>
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
                  rows={6}
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

