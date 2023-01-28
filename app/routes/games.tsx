import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import { useState } from "react";
import type { OutletContext } from "~/types/outlet";
import { getSupabaseServerClient } from "~/utils/supabase";

// Redirect the user to the login page if he is not logged in
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = getSupabaseServerClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login", { headers: response.headers });
  }

  return json({ userEmail: session.user.email }, { headers: response.headers });
};

export default function GamesLayout() {
  const submit = useSubmit();
  const { userEmail } = useLoaderData<typeof loader>();
  const { supabase } = useOutletContext<OutletContext>();
  const [logoutError, setLogoutError] = useState<string>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLogoutError(error.message);
    } else {
      // Send a get request to trigger the current route loader
      submit(null, { method: "get" });
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-slate-900">
      <div className="flex w-screen justify-between">
        {userEmail && <p className="justify-start m-2">Hello, {userEmail} !</p>}
        <div className="flex flex-col">
          <button
            onClick={handleLogout}
            className="bg-red-500 py-1 px-2 m-2 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
          >
            Logout
          </button>
          {logoutError && (
            <p className="text-red-400 font-bold">
              We were unable to log you out.
            </p>
          )}
        </div>
      </div>
      <h1 className="text-4xl text-red-500 m-4 font-bold">
        List of video games
      </h1>
      <Outlet context={{ supabase }} />
    </div>
  );
}
