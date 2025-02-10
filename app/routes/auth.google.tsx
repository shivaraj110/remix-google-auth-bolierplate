import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader = () => redirect("/login");

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("google", request);
};
