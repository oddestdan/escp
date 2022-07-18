import { Link } from "@remix-run/react";

// import { useOptionalUser } from "~/utils";

export default function Index() {
  // const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        {/* {user ? (
          <Link
            to="/notes"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            View Notes for {user.email}
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600  "
            >
              Log In
            </Link>
          </div>
        )} */}

        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Link to="/posts" className="text-xl text-blue-600 underline">
            Blog Posts
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Link to="/escp" className="text-xl text-stone-900 underline">
            escp.90
          </Link>
        </div>
      </div>
    </main>
  );
}
