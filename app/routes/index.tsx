import { redirect } from "@remix-run/node";

// redirect the user to the login page
export const loader = () => {
  return redirect("/login");
};
