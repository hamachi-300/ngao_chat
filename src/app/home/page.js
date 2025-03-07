
'use client';

import {signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Home = () => {
  const {data: session} = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div>
        Welcome you are logged in!!
        <br />
        <button onClick={() => signOut()}>Sign Out!</button>
    </div>
  )
}

export default Home
