import { Link, useOutletContext, useSubmit } from "@remix-run/react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { OutletContext } from "~/types/outlet";
import Field from "~/components/Field";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSupabaseServerClient } from "~/utils/supabase";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "~/utils/validations";
import type { LoginForm } from "~/types/login";

// Redirect the user to the dashboard if he is already logged in
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = getSupabaseServerClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/games", { headers: response.headers });
  }

  return null;
};

export default function Login() {
  const { supabase } = useOutletContext<OutletContext>();
  const submit = useSubmit();
  const [loginError, setLoginError] = useState<string>();
  const methods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (values) => {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setLoginError(error.message);
    } else {
      // Send a get request to trigger the current route loader
      submit(null, { method: "get" });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">Login</h1>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col items-center mb-4 p-2 border-2 border-slate-500 bg-slate-700 rounded"
        >
          <Field
            name="email"
            label="Email"
            type="email"
            placeholder="john@mail.com"
            disabled={methods.formState.isSubmitting}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            placeholder="*****"
            disabled={methods.formState.isSubmitting}
          />
          <fieldset>
            <button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className="bg-red-500 py-1 px-2 mt-2 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
            >
              Login
            </button>
          </fieldset>
          {loginError && <p className="text-red-500">{loginError}</p>}
        </form>
        <div>
          <Link
            to="/register"
            className="bg-red-500 px-2 py-1 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </FormProvider>
  );
}
