import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'axios';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../context/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const router = useRouter(); 

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  // ha bevagyunk jelentkezve nem akarjuk, hogy a user lathassa a login paget
  if (authenticated) router.push('/');
  
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await Axios.post('/login', {
        password,
        username,
      });

      dispatch( 'LOGIN', res.data );
      // redirect to login page with nextjs router
      router.push('/');
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/pattern.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <InputGroup
              className="mb-2"
              type="text"
              value={username}
              setValue={setUsername}
              placeholder="USERNAME"
              error={errors.username}
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="PASSWORD"
              error={errors.password}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded ">
              Login
            </button>
          </form>
          <small>
            New to Reddit?
            <Link href="/register">
              <a className="mb-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
