import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react"
import classNames from 'classnames';
import { useRouter } from "next/router";

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<any>>({});

  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post('/subs', { name, title, description });
      router.push(`/r/${res.data.name}`);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create community</title>
      </Head>

      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/pattern.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w98">
          <h1 className="mb-2 text-lg font-medium">Create Community</h1>
          <hr />
          <form onSubmit={onSubmit}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed.
              </p>
              <input 
                type="text" 
                className={
                  classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                   { 'border-red-600': errors.name })}
                value={name}
                onChange={e => setName(e.target.value)}  
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-500">
                Community title represents the topic and you can change it at anytime.
              </p>
              <input 
                type="text" 
                className={
                  classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                   { 'border-red-600': errors.title })}
                value={title}
                onChange={e => setTitle(e.target.value)}  
              />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed.
              </p>
              <textarea 
                className={
                  classNames("w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                   { 'border-red-600': errors.description })}
                value={description}
                onChange={e => setDescription(e.target.value)}  
              />
              <small className="font-medium text-red-600">{errors.description}</small>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold capitalize blue button">Create Community</button>
            </div>
          </form>
        </div>
      </div>
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