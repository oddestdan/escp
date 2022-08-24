import { Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async () => {
  return redirect("/escp");
};

export default function Index() {
  return (
    <main className="font-sans relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Link to="/escp" className="text-xl text-stone-900 underline">
            escp.90
          </Link>
        </div>
      </div>
    </main>
  );
}
