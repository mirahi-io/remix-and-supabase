import { yupResolver } from "@hookform/resolvers/yup";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import Field from "~/components/Field";
import type { Game, GameForm } from "~/types/games";
import { supabase } from "~/utils/supabase";
import { gameValidationSchema } from "~/utils/validations";

// fetch a specific video game on the server based on his id and then return it to the client
export const loader = async ({ params }: LoaderArgs) => {
  const { gameId } = params;
  const { data } = await supabase
    .from("video_games")
    .select("*")
    .eq("id", gameId);
  return json({
    defaultValues: data?.[0] as Game,
  });
};

// update a video game based on his id on the server
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name");
  const developer = formData.get("developer");
  const publisher = formData.get("publisher");
  const { error } = await supabase
    .from("video_games")
    .update({ name, developer, publisher })
    .eq("id", id);
  if (error) {
    return json({ error });
  }
  return redirect("/games");
};

export default function Edit() {
  const transition = useTransition();
  const submit = useSubmit();
  const { defaultValues } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const methods = useForm<GameForm>({
    defaultValues: {
      name: defaultValues.name,
      developer: defaultValues.developer,
      publisher: defaultValues.publisher,
    },
    resolver: yupResolver(gameValidationSchema),
  });
  const { handleSubmit } = methods;

  // send the new video game data to the server as a form
  const onSubmit: SubmitHandler<GameForm> = (values) => {
    submit({ id: defaultValues.id.toString(), ...values }, { method: "post" });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">Edit {defaultValues.name}</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mb-4 p-2 border-2 border-slate-500 rounded"
        >
          <Field
            name="name"
            label="Name"
            type="text"
            placeholder="World of Warcraft"
            disabled={transition.state === "submitting"}
          />
          <Field
            name="developer"
            label="Developer"
            type="text"
            placeholder="Blizzard"
            disabled={transition.state === "submitting"}
          />
          <Field
            name="publisher"
            label="Publisher"
            type="text"
            placeholder="Activision"
            disabled={transition.state === "submitting"}
          />
          <fieldset>
            <button
              type="submit"
              className="bg-red-500 py-1 px-2 mt-2 hover:bg-red-600 focus:bg-red-600 rounded"
            >
              {transition.state === "submitting" ? "Adding..." : "Add"}
            </button>
          </fieldset>
          {actionData?.error && (
            <div>
              <p>{actionData.error.code}</p>
              <p>{actionData.error.message}</p>
              <p>{actionData.error.hint}</p>
              <p>{actionData.error.details}</p>
            </div>
          )}
        </form>
        <Link
          to="/games"
          className="bg-red-500 p-2 hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Go back
        </Link>
      </div>
    </FormProvider>
  );
}
