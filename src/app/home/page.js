
'use client';

import {signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

const Home = () => {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
        router.push("/login");
    }
  }, [session, router]);

  return !session ? (<></>) : (
    <div>
        <img src={session.user?.image} />
        <p>Your Name: {session.user?.name}</p>
        <p>Your Email: {session.user?.email}</p>
        <br />
        <button onClick={() => signOut()}>Sign Out!</button>
    </div>
  )
}

export default Home
