import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  createBrowserClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";
import styles from "./tailwind.css";
import type { Database } from "./types/database";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

// Return the user session and env values to the client
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const env = {
    API_URL: process.env.API_URL!,
    API_KEY: process.env.API_KEY!,
  };
  const supabase = createServerClient<Database>(
    process.env.API_URL!,
    process.env.API_KEY!,
    { request, response }
  );

  // Retrieves the user session to synchronize it with the client
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json({ env, session }, { headers: response.headers });
};

export default function App() {
  const submit = useSubmit();
  const { env, session } = useLoaderData<typeof loader>();
  const serverAccessToken = session?.access_token;
  // Create a single instance of the supabase client to be used on the client side
  const [supabase] = useState(
    createBrowserClient<Database>(env.API_URL, env.API_KEY)
  );

  // Synchronize the client-side supabase instance with the server-side one
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // If the tokens are not the same, this means client and server are not synchronized
      // Thus we send a get request to trigger the loader which will provide the client a new Supabase client instance
      if (session?.access_token !== serverAccessToken) {
        submit(null, { method: "get" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, submit, supabase.auth]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="text-white">
        {/** Pass the supabase client down to every child components via the outlet context */}
        <Outlet context={{ supabase }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
