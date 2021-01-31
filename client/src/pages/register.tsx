import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'axios';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';

const titleMeta = "Register in Reddit";
const descriptionMeta = "Register page of Reddit app";

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const { authenticated } = useAuthState();
  if (authenticated) router.push('/');
  
  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (!agreement) {
      setErrors({ ...errors, agreement: 'You must agree to T&Cs' });
      return;
    }

    try {
      await Axios.post('/register', {
        email,
        password,
        username,
      });
      // redirect to login page with nextjs router
      router.push('/login');
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

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
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                id="agreement"
                className="mr-1 cursor-pointer"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Reddit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="EMAIL"
              error={errors.email}
            />
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
              Sign Up
            </button>
          </form>
          <small>
            Already a redditor?
            <Link href="/login">
              <a className="mb-1 text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
