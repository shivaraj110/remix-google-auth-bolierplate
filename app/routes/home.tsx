import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect("/login");
  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.logout(request, { redirectTo: "/login" });
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Home() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen items-center justify-center">
      {"Hi there " + user?.username}
      <form method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
