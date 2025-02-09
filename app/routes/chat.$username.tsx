import type { MetaFunction } from "@remix-run/node";
import ChatRoom from "~/components/chat-room";

export const meta: MetaFunction = () => {
	return [{ title: "Chat Room" }];
};

export default function ChatPage() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Chat Application</h1>
			<ChatRoom />
		</div>
	);
}
