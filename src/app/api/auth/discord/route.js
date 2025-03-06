import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Get the authorization code from the URL (Discord's redirect)
    const url = new URL(request.url);
    const code = url.searchParams.get('code'); // Discord sends the 'code' as a query parameter

    if (!code) {
        // If there's no code, the login failed (possibly canceled)
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login page
    }

    // Define your Discord app credentials
    const discordClientId = '1347047527559462983'; // Replace with your Discord Client ID
    const discordClientSecret = ''; // Replace with your Discord Client Secret
    const redirectUri = 'http://localhost:3000/api/auth/discord'; // Make sure this matches the Discord developer portal redirect URI

    // Prepare the body for the token request
    const body = new URLSearchParams({
        client_id: discordClientId,
        client_secret: discordClientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri, // Must match the one set in Discord developer portal
    });

    // Send the request to Discord's token endpoint
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    const data = await response.json();

    if (!data.access_token) {
        // If there's no access token, authentication failed
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect the user to login page
    }

    // Optionally, get user info using the access token (this step is optional)
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${data.access_token}`,
        },
    });

    const user = await userResponse.json();

    // Here, you can store the user information in a session, cookie, or database as needed
    const res = NextResponse.redirect(new URL('/home', request.url)); // Redirect to the home page after login
    res.cookies.set('discord_access_token', data.access_token, { httpOnly: true });

    return res; // Return the response to redirect the user
}
