import type { AppProps /*, AppContext */ } from 'next/app';
import Axios from 'axios';
import Navbar from '../components/Navbar';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr'


import { AuthProvider } from '../context/auth';

import '../styles/tailwind.css';
import '../styles/icons.css';

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
Axios.defaults.withCredentials = true; // we always want to send cookies!!!

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (error) {
    console.log(error.response.data)
    throw error.response.data; // mivel ez axios!!!!
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    // add meg a default fetch vagy axios functiont
    // SWR nagyon jo data fetchelo, mert eloszor cachet nezi meg, es csak utana keri le az uj adatokat ha vannak
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000 // ha ugyanarra az oldalra megyunk mennyi ido mulva fetchelje le ujra az adatokat
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
