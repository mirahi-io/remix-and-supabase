import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ActionArgs,
  ErrorBoundaryComponent,
  LoaderArgs,
} from "@remix-run/node";
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
import type { GameForm } from "~/types/games";
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
    defaultValues: data?.[0],
  });
};

// update a video game based on his id on the server
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const name = formData.get("name")?.toString();
  const developer = formData.get("developer")?.toString();
  const publisher = formData.get("publisher")?.toString();

  if (!id || !name || !developer || !publisher) {
    return json({ error: "Unable to retrieve form values" });
  }

  const { error } = await supabase
    .from("video_games")
    .update({ name, developer, publisher })
    .eq("id", id);

  if (error) {
    return json({ error: error.message });
  }

  return redirect("/games");
};

// catch any error thrown in this component and display an UI
export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div>
      <h1 className="text-black">We couldn't find this page!</h1>
      <p className="text-black">{error.message}</p>
    </div>
  );
};

export default function Edit() {
  const transition = useTransition();
  const submit = useSubmit();
  const { defaultValues } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (!defaultValues?.id) {
    throw new Error("This item doesn't exist");
  }

  const methods = useForm<GameForm>({
    defaultValues: {
      name: defaultValues?.name,
      developer: defaultValues?.developer,
      publisher: defaultValues?.publisher,
    },
    resolver: yupResolver(gameValidationSchema),
  });
  const { handleSubmit } = methods;

  // send the new video game data to the server as a form
  const onSubmit: SubmitHandler<GameForm> = (values) => {
    submit({ id: defaultValues?.id.toString(), ...values }, { method: "post" });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">
          Edit {defaultValues?.name}
        </h1>
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
              className="bg-red-500 py-1 px-2 mt-2 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
            >
              {transition.state === "submitting" ? "Saving..." : "Save"}
            </button>
          </fieldset>
          {actionData?.error && (
            <div>
              <p className="text-red-500">{actionData.error}</p>
            </div>
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
