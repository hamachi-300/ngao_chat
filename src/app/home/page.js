'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostModal from './modal/PostModal';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const getPosts = async () => {
    const response = await fetch('/api/data/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    setPosts(posts);
  };

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await getPosts();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (status === 'loading' || isLoading) {
    return <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>;
  }

  if (error)
    return (
      <div className='mt-14 text-center text-red-500 text-lg'>
        Error: {error}
      </div>
    );

  if (!session) return null;

  return (
    status === 'authenticated' &&
    session?.user && (
      <div className='p-6 max-w-4xl mx-auto'>
        <div className='flex justify-between mb-6'>
          <button
            onClick={() => signOut()}
            className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
          >
            Sign Out
          </button>
          <div className='flex gap-4'>
            <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
              Notifications
            </button>
            <PostModal user_id={session.user.id} />
          </div>
        </div>

        <ul className='space-y-4'>
          {posts.map((post, id) => (
            <li key={id} className='bg-white p-4 rounded shadow-md'>
              <p className='mb-2 text-gray-800'>{post.post_content}</p>
              <div className='flex gap-2'>
                <button className='text-green-600 hover:text-green-700'>
                  Like {post.like}
                </button>
                <button className='text-blue-600 hover:text-blue-700'>
                  Comment
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Home;
