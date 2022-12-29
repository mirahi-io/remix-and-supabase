import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import GameCard from "~/components/GameCard";
import { supabase } from "~/utils/supabase";

// fetch the list of video games on the server and return them to the client side
export const loader = async () => {
  const { data, error } = await supabase.from("video_games").select("*");
  return json({ games: data, error });
};

// handle the deletion of a video game on the server
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const { error } = await supabase.from("video_games").delete().eq("id", id);
  return json({ error });
};

export default function Index() {
  const { games, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  // send the id of the video game to delete as a form to the server
  const handleDelete = (id: number) => {
    submit({ id: id.toString() }, { replace: true, method: "post" });
  };

  if (!games || error) {
    return (
      <div className="flex flex-col items-center h-screen font-bold bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">List of video games</h1>
        <Link
          to="create"
          className="bg-slate-100 p-2 text-black hover:bg-slate-400 focus:bg-slate-400 rounded"
        >
          Add a video game
        </Link>
        <div>
          <p>Unable to fetch the video games list.</p>
          <p className="text-red-500">{error?.code}</p>
          <p className="text-red-500">{error?.hint}</p>
          <p className="text-red-500">{error?.message}</p>
          <p className="text-red-500">{error?.details}</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center h-screen font-bold bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">List of video games</h1>
        <p>The list is empty.</p>
        <Link
          to="create"
          className="bg-slate-100 p-2 text-black hover:bg-slate-400 focus:bg-slate-400 rounded"
        >
          Add a video game
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen bg-slate-900">
      <h1 className="text-4xl text-red-500 m-4 font-bold">
        List of video games
      </h1>
      <Link
        to="create"
        className="bg-slate-100 p-2 text-black hover:bg-slate-400 focus:bg-slate-400 rounded"
      >
        Add a video game
      </Link>
      <ul className="m-2">
        {games.map((game) => (
          <GameCard
            key={game.id}
            handleDelete={handleDelete}
            deletionError={actionData?.error?.message}
            {...game}
          />
        ))}
      </ul>
    </div>
  );
}
