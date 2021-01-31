import Axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react"
import { useRouter } from "next/router";
import CreateSubInput from "../../components/CreateSubInput";
import { useAuthState } from "../../context/auth";

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<any>>({});
  const { authenticated } = useAuthState();
  const router = useRouter();

  if (!authenticated) router.push('/login');


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

  const titleMeta = "Create new Community";
  const descriptionMeta = "Create new Community in Reddit";

  return (
    <div className="flex bg-white">
      <Head>
        <title>{titleMeta}</title>
        <meta name="description" content={descriptionMeta} />
        <meta property="og:description" content={descriptionMeta} />
        <meta property="og:title" content={titleMeta} />
        <meta property="twitter:description" content={descriptionMeta} />
        <meta property="twitter:title" content={titleMeta} />
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
            <CreateSubInput 
              fieldName="Name"
              fieldDesc="Community names including capitalization cannot be changed."
              fieldValue={name}
              error={errors.name}
              setFieldValue={setName}
              inputType="input"
            />
            <CreateSubInput 
              fieldName="Title"
              fieldDesc="Community title represents the topic and you can change it at anytime."
              fieldValue={title}
              error={errors.title}
              setFieldValue={setTitle}
              inputType="input"
            />
            <CreateSubInput 
              fieldName="Description"
              fieldDesc="Community names including capitalization cannot be changed."
              fieldValue={description}
              error={errors.description}
              setFieldValue={setDescription}
              inputType="textarea"
            />
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