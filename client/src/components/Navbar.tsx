import Axios from 'axios';
import Link from 'next/link';
import { useAuthDispatch, useAuthState } from '../context/auth';
// import RedditLogo from '../images/reddit.svg;

const Navbar: React.FC = () => {
  const dispatch = useAuthDispatch();
  const { authenticated, loading } = useAuthState();

  const logout = () => {
    Axios.get('/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            {/* <RedditLogo className="w-8 h-8 mr-2" /> */}
            <img
              className="w-8 h-8 mr-2"
              src="https://external-preview.redd.it/iDdntscPf-nfWKqzHRGFmhVxZm4hZgaKe5oyFws-yzA.png?auto=webp&s=38648ef0dc2c3fce76d5e1d8639234d8da0152b2"
              alt="reddit logo"
            />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">Reddit</Link>
        </span>
      </div>

      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search" />
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded focus:outline-none w-160"
          placeholder="Search"
        />
      </div>

      <div className="flex">
        {!loading && (authenticated ? (
          <button 
            className="w-32 py-1 mr-5 leading-5 holo blue button" 
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              <a className="w-32 py-1 mr-5 leading-5 holo blue button">Log In</a>
            </Link>
            <Link href="/register">
              <a className="w-32 py-1 leading-5 blue button">Sign Up</a>
            </Link>
          </>
        ))}
      </div>
    </div>
  )
};

export default Navbar;
