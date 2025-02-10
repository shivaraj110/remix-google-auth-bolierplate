import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { useState } from "react";
import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect("/login");
  return { user };
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [userName, setUserName] = useState("");
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex-col">
        <div>Enter your name please!</div>
        <input
          className="block"
          placeholder="Chikna"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <Link to={`/chat/${userName}`} className="text-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
