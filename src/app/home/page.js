
'use client';

import {signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

const Home = () => {

    //const [loading, setLoading] = useState(true);
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }

        console.log(session);
    }, [session, router]);

    return !session ? (<></>) : (
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
