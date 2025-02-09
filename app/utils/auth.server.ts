import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
interface User {
	name: String
	email: String
}
// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

let auth0Strategy = new Auth0Strategy(
	{
		callbackURL: "http://localhost:5173/auth/auth0/callback",
		clientID: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		domain: "google.us.auth0.com",
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		// Get the user data from your DB or API using the tokens and profile
		return User.findOrCreate({ email: profile.emails[0].value });
	},
);

authenticator.use(auth0Strategy);
