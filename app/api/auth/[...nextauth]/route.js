require("dotenv").config();
// [...nextauth] is a folder for specifying dynamic route. Dynamic route folder are named with square bracket

// To generate NEXTAUTH_SECRET environment variable value mainly for production go to
// https://www.cryptool.org/en/cto/openssl/  and then type in the command "openssl rand -base64 32"

// GOOGLE
// To get the "clientId" and "clientSecret" for Google Provider, go to https://console.cloud.google.com and
// sign-in with your gmail account. Select "manage project" and then "new project", then enter the
// "project name". Click "Select project" after the project creation and then click the menu icon on the
// top-left corner of the page to open it and then select "APIs & services", then "OAuth consent screen",
// then "Get started". Fill the form information: "app name", select "external" under the audience, enter your
// gmail for the "contact email". Then click "create" to submit. Thereafter, on the new pop-up page, click
// "create OAuth client", choose "web application" under the "application type", enter the "name" or use the
// one provided by google by default i.e. "Web client 1", fill "http://localhost:3000" for the "Authorized
// Javascript origins" and http://localhost:3000/api/auth/callback/google for the "Authorized redirect URIs",
// then click "create". After creation, click the client name e.g. "Web client 1" to see the clientId and clientSecret.

// GITHUB
// To get the "clientId" and "clientSecret" for GitHub Provider, sign-in to GitHub and click on your profile
// picture at the upper-right corner and select "Settings". On the left sidebar, click on "Developer settings"
// and then select "OAuth Apps" and then click the "New OAuth App" button. Fill only the "Application name",
// "Homepage URL" as "http://localhost:3000" and "Ahthorization callback URL" as "http://localhost:3000/api/auth/callback/github",
// and ignore other fields. Click "Register application" to finish the setup configuration. After creation,
// GitHub will generate a clientId and clientSecret for you which can be copied to your application .env file

// IMAGES
// configure "next.config.mjs" to be able to load profile images from GitHub and Google.

import NextAuth from "next-auth"; // npm install next-auth     use the code to install it
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import connectToDB from "@utils/dbconnection";
import UserSchemaModel from "@models/user-schema"; // import ofthe database schema

// NextAuth() is used for authentication in nextjs e.g. Google and GitHub authentication in this case
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    // Set-up the route pages for handling the callback error and response if not using the home page "localhost:3000"
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/",
    },
    callbacks: {
        async signIn({ profile, account }) {
            // "profile" and "account" are both object. Their values come from the "providers" above
            try {
                await connectToDB();

                // console.log("Profile:", profile);
                // console.log("Account:", account);

                // Check if a user already exist
                const userExists = await UserSchemaModel.findOne({
                    email: profile.email,
                });

                // if user does not exist, create one
                if (!userExists) {
                    const newUser = await UserSchemaModel.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture || profile.avatar_url, // Google uses 'picture', GitHub uses 'avatar_url'
                        provider: account.provider,
                        providerId: profile.id || profile.sub, // GitHub uses 'id', Google uses 'sub'
                    });
                    // console.log("New user created:", newUser);
                }
                return true; // allow sign-in
            } catch (error) {
                console.error("Error signing in... ", error);
                return false; // deny sign-in
            }
        },
        // This runs after signIn and modifies the session. The session is available after user has signed in,
        // and "session.user" is populated with values from the "profile" object in the signIn() function above.
        async session({ session }) {
            try {
                await connectToDB();
                // Find the user in database and add their MongoDB ID to the running session
                const sessionUser = await UserSchemaModel.findOne({
                    email: session.user.email,
                });

                // assign the id from the database for the user to the user session id
                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                    session.user.provider = sessionUser.provider;
                }

                // console.log("Session with DB id: ", session);
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session;
            }
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // this export approach works for this project