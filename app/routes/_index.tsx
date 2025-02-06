import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
<div className="flex-col text-center">
<div>
{'Welcome to the Chat!'}
</div>
<div className="animate-pulse">
{'Connecting to Websocket...'}
</div>
</div>
</div>
  );
}


