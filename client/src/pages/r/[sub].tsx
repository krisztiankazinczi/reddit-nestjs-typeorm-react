import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import { Sub } from "../../types";
import Image from 'next/image';
import { ChangeEvent, createRef, useEffect, useState } from "react";
import { useAuthState } from '../../context/auth';
import classNames from 'classnames';
import Axios from "axios";
import Sidebar from '../../components/Sidebar';

export default function SubPage() {
  // Local State
  const [ownSub, setOwnSub] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // Global State
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();
  const subName = router.query.sub;
  const fileInputRef = createRef<HTMLInputElement>()
  // kezdetben nincs erteke a router.querynak!!! -> felteteles fetching SWR-ral
  const { data: sub, error, revalidate } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user?.username === sub.username);
  }, [sub])

  useEffect(() => {
    if (!sub) return;
    let desc = sub?.description || sub.title;
    desc = desc.substring(0, 158).concat('..'); // this is suggested, the description meta should be 150-160 character
    setDescription(desc);
    setImageUrl(sub.imageUrl);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    if (fileInputRef.current) {
      fileInputRef.current.name = type;
      fileInputRef.current.click();
    }
  }

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    if (file && fileInputRef.current) {
      formData.append('file', file);
      formData.append('type', fileInputRef.current.name);
    }

    try {
      if (sub) {
        await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data'}
        });
      }

      revalidate();
    } catch (error) {
      console.log(error);
    }

  }


  if (error) {
    router.push('/');
  }

  let postMarkup;
  if (!sub) {
    postMarkup = <p className="text-lg text-center">Loading...</p>
  } else if (sub.posts.length === 0) {
    postMarkup = <p className="text-lg text-center">No posts submitted yet</p>
  } else {
    postMarkup = sub.posts.map(post => (
      <PostCard key={post.identifier} post={post} revalidate={revalidate} />
    ))
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
        <meta property="og:image" content={imageUrl} />
        <meta property="twitter:image" content={imageUrl} />
        <link rel="icon" type="image/jpg" href={imageUrl} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={sub?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={sub?.title} />
      </Head>
        {sub && (
          <>
          <input type="file" hidden={true} ref={fileInputRef} onChange={uploadFile} />
          {/* Sub info and images */}
            <div>
              <div className={classNames("bg-blue-500", { 'cursor-pointer': ownSub })}
              onClick={() => openFileInput('banner')}>
                {/* Sub image */}
                {sub.bannerUrl ? (
                  <div className="relative h-56 bg-blue-500">
                    <Image
                      src={sub.bannerUrl}
                      alt="Banner URL"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  // <div className="h-56 bg-blue-500" style={{ 
                  //   backgroundImage: `url(${sub.bannerUrl})`,
                  //   backgroundRepeat: 'no-repeat',
                  //   backgroundSize: 'cover',
                  //   backgroundPosition: 'center'
                  // }} ></div>
                ) : (
                  <div className="h-20 bg-blue-500"></div>
                )}
                </div>
                {/* Sub metadata */}
                <div className="h-20 bg-white">
                  <div className="container relative flex">
                    <div className="absolute" style={{top: -15}}>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className={classNames("rounded-full", { 'cursor-pointer': ownSub })}
                        onClick={() => openFileInput('image')}
                        width={70}
                        height={70}
                        objectFit="cover"
                      />
                    </div>
                    <div className="pt-1 pl-24">
                      <div className="flex items-center">
                        <h1 className="mb-1 text-xl font-bold md:text-2xl lg:text-3xl">{sub.title}</h1>
                      </div>
                      <p className="text-sm font-bold text-gray-500">{sub.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            
          {/* Posts and Sidebar */}
            <div className="container flex pt-5">
              <div className="w-160">
                {postMarkup}
              </div>
              <Sidebar sub={sub} />
            </div>
          </>
        )}
    </div>
  )
}