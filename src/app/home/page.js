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
  const [liked, setLiked] = useState([]);
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

      const commentCounts = await Promise.all(
        postsData.map(async (post) => {

          if (post.like.includes(session.user.id)) {
            setLiked((prev) => [...prev, post.post_id]);
          }

          const commentResponse = await fetch(`/api/data/comments?postId=${post.post_id}`);

          if (!commentResponse.ok) {
            console.warn(`Failed to fetch comments for post ${post.post_id}`);
            return { post_id: post.post_id, count: 0 };
          }

          const commentsData = await commentResponse.json();

          return { post_id: post.post_id, comments: commentsData };
        })
      );

      // Create a map of post IDs to comment counts
      const commentCountMap = commentCounts.reduce((map, { post_id, comments }) => {
        map[post_id] = comments.length;
        return map;
      }, {});

      // Map the posts with the correct username
      const postsWithUsername = postsData.map(post => ({
        ...post,
        username: userMap[post.author_id] || `@${post.author_id}`,
        commentCount: commentCountMap[post.post_id] || 0
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
    if (status === 'authenticated') {
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
    }
  }, [status]);

  async function unlike(post) {

    post.like = post.like.filter(u => u !== session.user.id);

    setLiked((prev) => {
      let arr = prev.filter(p => p !== post.post_id);
      return arr;
    });
    
    try {
      const response = await fetch(`/api/data/posts/${post.post_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'unlike', user_id: session.user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
    } catch (error) {
      console.error('Error sync to database:', error);
    }
  }

  async function like(post) {

    post.like.push(session.user.id);

    setLiked((prev) => [...prev, post.post_id]);

    try {
      const response = await fetch(`/api/data/posts/${post.post_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'like', user_id: session.user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
    } catch (error) {
      console.error('Error sync to database:', error);
    }
  }

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
        <div className='p-6 max-w-4xl mx-auto bg-[#0c163d] w-200 min-h-screen relative pb-24'>
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
                      <button onClick={() => {
                        
                        if (!liked.includes(post.post_id)) {
                          like(post);
                        } else { 
                          unlike(post);
                        }

                      }} className={`cursor-pointer text-2xl hover:scale-110 ease-out transition-transform duration:150 
                      ${liked.includes(post.post_id) ? "text-red-500 scale-110" : "text-white scale-100"} 
                      ${liked.includes(post.post_id) && "animate-pulse"}`}>

                        <AiOutlineHeart />

                      </button>
                      <p className='duration-250 transition-all'>{post.like.length}</p>
                    </div>

                    <div className='flex gap-1.5'>
                      <button onClick={() => router.push(`/comment/${post.post_id}`)} className='hover:scale-110 transition-all duration:150 text-white text-xl cursor-pointer'><FaRegComment /></button>
                      <p>{post.commentCount}</p>
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
