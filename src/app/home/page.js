'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {

    console.log('0');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get the access token from cookies
        const token = getCookie('discord_access_token');

        if (!token) {
            console.log('1');
            window.location.href = '/login'; // Redirect to login if no token
            return;
        }

        // Fetch user data from Discord API using the access token
        async function fetchUserData() {
            try {
                const response = await fetch('https://discord.com/api/v10/users/@me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData); // Store user data in state
                } else {
                    // Handle error if the API request fails

                    console.log('2');
                    window.location.href = '/login'; // Redirect to login if fetching fails
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                console.log('3');
                window.location.href = '/login'; // Redirect to login if an error occurs
            } finally {
                setLoading(false); // Stop loading once the request is complete
            }
        }

        fetchUserData();
    }, []);

    // Utility function to get cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Display a loading state while fetching user data
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Error: Unable to fetch user data.</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <div>
                <img
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                    alt={`${user.username}'s avatar`}
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
            </div>
            <p>Email: {user.email || 'Not provided'}</p>
            <p>Discord ID: {user.id}</p>
            <p>Account Created: {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    );
}
