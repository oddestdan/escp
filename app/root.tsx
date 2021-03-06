import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import sharedStylesheetUrl from "./styles/shared.css";
import { getUser } from "./session.server";
import { Provider } from "react-redux";
import { store } from "./store";

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100;200;300;400;500;700&display=swap",
    }, // IBM Plex Mono
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css",
    }, // slick carousel
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css",
    }, // slick carousel theme
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css",
    }, // full calendar
    // {
    //   rel: "stylesheet",
    //   href: "https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/locales-all.min.js",
    // }, // full calendar locales
    { rel: "stylesheet", href: sharedStylesheetUrl }, // MUST BE LAST
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "escp.90",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  return (
    <Provider store={store}>
      <html lang="en" className="h-full">
        <head>
          <Meta />
          <Links />
        </head>
        <body className="h-full selection:bg-stone-800 selection:text-stone-100">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </Provider>
  );
}
