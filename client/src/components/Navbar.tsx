import Axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { Sub } from '../types';
import Image from 'next/image'
import { useRouter } from 'next/router';
// import RedditLogo from '../images/reddit.svg;

const Navbar: React.FC = () => {
  const dispatch = useAuthDispatch();
  const { authenticated, loading } = useAuthState();
  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState<Timeout | null>(null)

  const router = useRouter();

  const logout = () => {
    Axios.get('/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch(err => console.log(err));
  }

  const demoLogin = () => {
    Axios.get('/demo-login')
      .then((res) => {
        dispatch( 'LOGIN', res.data );
        router.back(); 
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    //delete search results if every character deleted from search input
    if (name.trim() === '') {
      if (timer) clearTimeout(timer);
      setSubs([])
      return;
    }
    searchSubs()
  }, [name])

  const searchSubs = async () => {
    if (timer) clearTimeout(timer);
    
    setTimer(setTimeout(async () => {
      try {
        const { data: subs } = await Axios.get(`/subs/search/${name}`);
        setSubs(subs);
      } catch (error) {
        console.log(error)
      }
    }, 250))
  }

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName('');
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <a>
            {/* <RedditLogo className="w-8 h-8 mr-2" /> */}
            <img
              className="w-8 h-8 mr-2 "
              src="https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?auto=webp&s=38648ef0dc2c3fce76d5e1d8639234d8da0152b2"
              alt="reddit logo"
            />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">Reddit</Link>
        </span>
      </div>
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search" />
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded focus:outline-none md:lg-90 lg:w-160"
            placeholder="Search"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="absolute left-0 right-0 bg-white" style={{ top: '100%'}}>
            {subs?.map(sub => (
              <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}>
                <Image 
                  src={sub.imageUrl}
                  alt="Sub"
                  className="rounded-full"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {!loading && (authenticated ? (
          <button 
            className="hidden w-20 py-1 mr-5 leading-5 md:block lg:w-28 holo blue button" 
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <a 
              className="hidden w-20 py-1 mr-5 leading-5 cursor-pointer md:block lg:w-24 blue button"
              onClick={demoLogin}
            >Demo Login</a>
            <Link href="/login">
              <a className="hidden w-20 py-1 mr-5 leading-5 md:block lg:w-24 holo blue button">Log In</a>
            </Link>
            <Link href="/register">
              <a className="hidden w-20 py-1 leading-5 md:block lg:w-24 blue button">Sign Up</a>
            </Link>
          </>
        ))}
      </div>
    </div>
  )
};

export default Navbar;
