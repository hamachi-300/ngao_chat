
'use client';

import {signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

const Home = () => {

    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [status, router]);


    if (status === 'loading') {
        return (<p>Loading...</p>);
    }

    if (!session) return null;

    return (
        <div>
            <img src={session.user?.image} referrerPolicy="no-referrer"/>
            <p>Your Name: {session.user?.name}</p>
            <p>Your Email: {session.user?.email}</p>
            <br />
            <button onClick={() => signOut()}>Sign Out!</button>
        </div>
    )
}

export default Home
