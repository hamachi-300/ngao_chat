
'use client';

import {signOut, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import PostModal from "./modal/PostModal";

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const {data: session, status} = useSession();
    const router = useRouter();

    const getPosts = async () => {
        const response = await fetch('/api/data/posts')
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        setPosts(posts);
    }

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }

    }, [status, router]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                await getPosts();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    if (status === 'loading' || isLoading) {
        return (<p>Loading...</p>);
    }

    if (error) return <div className='mt-14'>Error: {error}</div>;

    if (!session) return null;

    return (
        status === 'authenticated' &&
        session?.user && (
          <div>
            <button onClick={() => signOut()}>Sign Out</button>
            <div id="sticky-buttons">
                <button>notification</button>
                <PostModal user_id={session.user.id}/>
            </div>
            <div>
                <ul>
                    {
                        posts.map((post, id) => (
                            <li key={id}>
                                <div>
                                    {post.post_content}
                                    <button>like {post.like}</button>
                                    <button>comment</button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
          </div>
        )
      )
}

export default Home
