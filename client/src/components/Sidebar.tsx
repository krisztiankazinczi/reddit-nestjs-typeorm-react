import dayjs from "dayjs";
import { Sub } from "../types";
import { useAuthState } from '../context/auth';
import Link from "next/link";

export default function Sidebar({ sub }: { sub: Sub }) {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden ml-6 md:block w-80">
      <div className="bg-white rounded">
        <div className="p-3 bg-blue-500 rounded-t">
          <p className="font-semibold text-white">About Community</p>
        </div>
        <div className="m-3">
          <p className="mb-3 text-md">{sub.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>6</p>
              <p>members</p>
            </div>
            <div className="w-1/2">
              <p>1</p>
              <p>online</p>
            </div>
          </div>
          <p className="my-3">
            <i className="mr-2 fas fa-birthday-cake"></i>
            Created {dayjs(sub.createdAt).format('D MMM YYYY')}
          </p>
          {authenticated && (
            <Link href={`/r/${sub.name}/submit`}>
              <a className="w-full py-1 mb-3 text-sm blue button">
                Create Post
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}