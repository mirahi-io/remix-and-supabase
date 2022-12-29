import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { supabase } from "~/utils/supabase";
import Field from "~/components/Field";
import type { GameForm } from "~/types/games";
import { gameValidationSchema } from "~/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";

// create a video game on the server
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const developer = formData.get("developer")?.toString();
  const publisher = formData.get("publisher")?.toString();

  if (!name || !developer || !publisher) {
    return json({ error: "Unable to retrieve the form values" });
  }

  const { error } = await supabase
    .from("video_games")
    .insert([{ name, developer, publisher }]);

  if (error) {
    return json({ error: error.message });
  }

  return redirect("/games");
};

export default function Create() {
  const transition = useTransition();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const methods = useForm<GameForm>({
    defaultValues: {
      name: "",
      developer: "",
      publisher: "",
    },
    resolver: yupResolver(gameValidationSchema),
  });
  const { handleSubmit } = methods;

  // send the new video game data to the server as a form
  const onSubmit: SubmitHandler<GameForm> = (values) => {
    submit(values, {
      method: "post",
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">Add a video game</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mb-4 p-2 border-2 border-slate-500 bg-slate-700 rounded"
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
              disabled={transition.state === "submitting"}
              className="bg-red-500 py-1 px-2 mt-2 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
            >
              {transition.state === "submitting" ? "Adding..." : "Add"}
            </button>
          </fieldset>
          {actionData?.error && (
            <p className="text-red-500">{actionData.error}</p>
          )}
        </form>
        <Link
          to="/games"
          className="bg-slate-100 px-2 py-1 min-w-[100px] text-center text-black hover:bg-slate-400 focus:bg-slate-400 rounded"
        >
          Go back
        </Link>
      </div>
    </FormProvider>
  );
}
