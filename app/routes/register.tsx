import { yupResolver } from "@hookform/resolvers/yup";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useOutletContext, useSubmit } from "@remix-run/react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import Field from "~/components/Field";
import type { OutletContext } from "~/types/outlet";
import type { RegisterForm } from "~/types/register";
import { getSupabaseServerClient } from "~/utils/supabase";
import { registerFormValidation } from "~/utils/validations";

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

export default function Register() {
  const { supabase } = useOutletContext<OutletContext>();
  const submit = useSubmit();
  const [registerError, setRegisterError] = useState<string>();
  const methods = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(registerFormValidation),
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (values) => {
    const { error } = await supabase.auth.signUp(values);

    if (error) {
      setRegisterError(error.message);
    } else {
      submit(null, { method: "get" });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center h-screen bg-slate-900">
        <h1 className="text-4xl text-red-500 m-4">Register</h1>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col items-center mb-4 p-2 border-2 border-slate-500 bg-slate-700 rounded"
        >
          <Field
            name="email"
            type="email"
            placeholder="john@mail.com"
            disabled={methods.formState.isSubmitting}
            label="Email"
          />
          <Field
            name="password"
            type="password"
            placeholder="*****"
            disabled={methods.formState.isSubmitting}
            label="Password"
          />
          <fieldset>
            <button
              className="bg-red-500 py-1 px-2 mt-2 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
              type="submit"
              disabled={methods.formState.isSubmitting}
            >
              Register
            </button>
          </fieldset>
          {registerError && (
            <p className="text-red-500">
              We were unable to create your account.
            </p>
          )}
        </form>
        <div>
          <Link
            to="/login"
            className="bg-red-500 px-2 py-1 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    </FormProvider>
  );
}
