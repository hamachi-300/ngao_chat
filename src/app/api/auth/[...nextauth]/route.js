import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'

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
})

export { handler as GET, handler as POST }