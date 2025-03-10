import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { createCookieSessionStorage } from "@remix-run/node";

// Configure session storage
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<any>(sessionStorage);


const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5173/auth/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Here, implement logic to find or create a user in your database
    // Example:
    const user = await findOrCreateUser({
      email: profile.emails[0].value,
      name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        profileId: profile.id,
    });
    return user;
  }
);

authenticator.use(googleStrategy);

async function findOrCreateUser({ email, name, avatar ,profileId}: { email: string; name: string; avatar?: string ,profileId: string}) {
const user = name    
return user;
}
