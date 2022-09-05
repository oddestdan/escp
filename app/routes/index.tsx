import { Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async () => {
  return redirect("/escp");
};

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white font-sans sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto mt-16 max-w-7xl text-center font-mono">
          тут нічого нема
          <Link to="/escp">.</Link>
        </div>
      </div>
    </main>
  );
}
