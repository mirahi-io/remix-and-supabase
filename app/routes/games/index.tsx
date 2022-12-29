import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import GameCard from "~/components/GameCard";
import type { Game } from "~/types/games";
import { supabase } from "~/utils/supabase";

// fetch the list of video games on the server and return them to the client side
export const loader = async () => {
  const { data, error } = await supabase.from("video_games").select("*");
  const games = data as Game[] | null;
  return json({ games, error });
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
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">List of video games</h1>
        <Link
          to="create"
          className="bg-red-500 p-2 hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Add a video game
        </Link>
        <p>Unable to fetch the video games list.</p>
        <p>{error?.code}</p>
        <p>{error?.hint}</p>
        <p>{error?.message}</p>
        <p>{error?.details}</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">List of video games</h1>
        <p>The list is empty.</p>
        <Link
          to="create"
          className="bg-red-500 p-2 hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Add a video game
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen bg-slate-900">
      <h1 className="text-4xl text-red-500 m-4">List of video games</h1>
      <Link
        to="create"
        className="bg-red-500 p-2 hover:bg-red-600 focus:bg-red-600 rounded"
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
