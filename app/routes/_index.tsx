import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	const [userName, setUserName] = useState('')
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex-col">

				<div>
					Enter your name please!
				</div>
				<input className="block" placeholder="Chikna" onChange={(e) => {
					setUserName(e.target.value)
				}} />
				<Link to={`/chat/${userName}`} className="text-lg">
					Get Started
				</Link>
			</div>
		</div>

	);
}


