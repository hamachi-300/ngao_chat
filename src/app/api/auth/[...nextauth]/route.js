import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/database/mongodb"

// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
const scopes = ['identify'].join(' ')

const handler = NextAuth({
  providers: [
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        authorization: {params: {scope: scopes}},
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  adapter: MongoDBAdapter(client)
})

export { handler as GET, handler as POST }