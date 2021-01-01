import Link from "next/link";
// nextjs will handle this as default 404 page, but subpages are not involved, just the main pages level
export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-10 mb-4 text-5xl text-gray-800">
        Page not found
      </h1>
      <Link href="/">
        <a href="/" className="px-4 py-2 blue button">Home</a>
      </Link>
    </div>
  )
}
