
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
        status === 'authenticated' &&
        session?.user && (
          <div>
            
          </div>
        )
      )
}

export default Home
