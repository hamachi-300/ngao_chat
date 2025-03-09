'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostModal from './modal/PostModal';
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setModal(!modal);
  };

  const getPosts = async () => {
    try {
        const response = await fetch('/api/data/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        let postsData = await response.json();

        // Extract all unique author IDs from posts
        const authorIds = [...new Set(postsData.map(post => post.author_id))];

        // Fetch all usernames based on the author IDs
        const authorResponse = await fetch('/api/data/user/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author_ids: authorIds })
        });

        if (!authorResponse.ok) {
            throw new Error('Failed to fetch usernames');
        }

        const authorData = await authorResponse.json();

        // Create a map of user IDs to usernames
        const userMap = authorData.reduce((map, user) => {
            map[user.id] = user.username;
            return map;
        }, {});

        // Map the posts with the correct username
        const postsWithUsername = postsData.map(post => ({
            ...post,
            username: userMap[post.author_id] || `@${post.author_id}`
        }));

        setPosts(postsWithUsername);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
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
      <>
        <div className='p-6 max-w-4xl mx-auto'>

          <ul className='space-y-6'>
            {posts.map((post, id) => (
              <li key={id} className='  shadow-md'>

                <div className='flex flex-col gap-1.5'>
                  <div className='bg-[#9290C3] p-4 shadow-md rounded-md flex flex-col justify-between '>
                    <p className='mb-2 font-bold text-white'>{post.post_content}</p>
                    <p className="ml-1 text-gray-300 font-semibold text-xs">{post.username}</p>
                  </div>
                  <div className='flex gap-4'>

                    <div className='flex gap-1.5'>
                      <button className='text-2xl'><AiOutlineHeart /></button>
                      <p>{post.like.length}</p>
                    </div>

                    <div className='flex gap-1.5'>
                      <button onClick={() => router.push(`/comment/${post.post_id}`)} className='text-white text-xl cursor-pointer'><FaRegComment /></button>
                      <p>{post.like.length}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
        </div>
        
        <div
          className='fixed items-end justify-end right-7 bottom-12 shadow-white'
        >
          <PostModal modal={modal} toggleModal={toggleModal} user_id={session.user.id} />
        </div>
      </>

    )
  );
};

export default Home;
