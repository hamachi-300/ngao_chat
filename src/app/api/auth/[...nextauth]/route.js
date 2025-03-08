import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/database/mongodb"

// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes

const handler = NextAuth({

  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          return {
            id: profile.sub, 
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            username: null
          };
        }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.image = token.picture;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.username = token.username;
      }

      console.log("Modified Session: ", session);
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  adapter: MongoDBAdapter(client)
})

export { handler as GET, handler as POST }