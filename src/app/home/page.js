'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostModal from './modal/PostModal';
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import ConfirmDelete from './modal/ConfirmDelete';
import { FaRegTrashAlt } from "react-icons/fa";


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);
  const [liked, setLiked] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const router = useRouter();
  const [refresh, setRefresh] = useState("");
  const [categories, setCategories] = useState("general");
  const pathname = usePathname();

  useEffect(() => {
      if (pathname.includes("#post-")) {
        const postId = pathname.split("#post-")[1];
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
  }, [pathname, isLoading]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleDropdown = (postId) => {
    setOpenDropdown((prev) => (prev === postId ? null : postId));
  };

  const confirmModalFunc = (post_id) => {
    setConfirmModal(post_id);
  }

  const compareTime = (hour, day) => {
    let current_day = new Date().getDate();
    let current_hour = new Date().getHours();

    if (current_day - day > 0){
        return (current_day - day) + " day";
    } else if (current_hour - hour > 0){
        return (current_hour - hour) + " hour";
    } else {
        return "recently";
    }
}

  const deletePost = async (post_id) => {
    try {
      const response = await fetch(`/api/data/posts/${post_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts((prev) => prev.filter((post) => post.post_id !== post_id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await fetch('/api/data/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      let postsData = await response.json();
      if (categories != "general") {
        postsData = postsData.filter(post => post.category == categories)
      }

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

          const commentResponse = await fetch(`/api/data/comment?postId=${post.post_id}`);

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
      const postsWithUsername = postsData
      .map(post => ({
        ...post,
        username: userMap[post.author_id] || `@${post.author_id}`,
        commentCount: commentCountMap[post.post_id] || 0,
      }))
      .sort((a, b) => new Date(b.time_stamp) - new Date(a.time_stamp));  // Sort by timestamp (latest first)

      setPosts(postsWithUsername);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const changeCatagory = (event) => {
    const { value } = event.target;
    setCategories(value);
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
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
  }, [status, refresh, categories]);

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
            <div className='mb-2'>
              <button onClick={(e) => changeCatagory(e)} value="general"
                className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "general" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
              >
                <FaComment className="inline"/> general
              </button>
              <button onClick={(e) => changeCatagory(e)} value="love" 
                className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "love" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
              >
                <FaHeart className="inline"/> love
              </button>
              <button onClick={(e) => changeCatagory(e)} value="game" 
                className={`pl-2 pr-2 p-1 m-1 ml-0 text-sm rounded-full transition-all duration-250 hover:opacity-80 ${categories == "game" ? "bg-[#535C91]" : "bg-[#9290C3] cursor-pointer"}`}
              >
                <FaGamepad className="inline"/> game
              </button>
            </div>
            {posts.map((post, id) => (
              <li key={id} id={`post-${post.post_id}`} className='shadow-md'>
                {console.log(post.time)}
                <div className='flex flex-col gap-1.5'>

                  <div className='bg-[#9290C3] shadow-md rounded-md justify-between relative'>
                    
                    <span
                      className={`pl-2 pr-2 p-1 mt-2 ml-2 ml-0 text-sm rounded-full text-gray-300 bg-[#8381AF] inline-block`}
                    >
                      {post.category == "general" && (<FaComment className="inline mr-1"/>)}
                      {post.category == "love" && (<FaHeart className="inline mr-1" />)}
                      {post.category == "game" && (<FaGamepad className="inline mr-1" />)}
                      {post.category}
                    </span>
                    <div className='flex justify-between'>
                      <div className='p-4 pt-1'>
                        <p className='mb-2 font-bold text-white mt-2'>{post.post_content}</p>
                        <p className="ml-1 text-gray-300 font-semibold text-xs">{post.username}</p>
                        <p className="ml-1 text-gray-300 font-semibold text-xs absolute top-0 right-0 pr-3 pt-3">{compareTime(new Date(post.time_stamp).getHours(), new Date(post.time_stamp).getDate())}</p>
                      </div>
                      <div className='text-[#e0e0e0] font-bold mt-2 mr-1 text-[1.25rem]'>
                        <CiMenuKebab onClick={() => toggleDropdown(post.post_id)}
                          className='text-white cursor-pointer hover:text-gray-300 hover:scale-110 transition-all duration-150'
                        />
                        <div className={`absolute text-xs right-8 mt-2 bg-white shadow-md rounded-md z-10 transition-all duration-200 ease-out transform ${openDropdown === post.post_id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>

                          {post.author_id === session.user.id &&
                            <button
                              className='py-1 rounded-md w-full text-left cursor-pointer '
                            >
                              {
                                <div onClick={() => setConfirmModal(post.post_id)} className=' px-4 py-1 hover:bg-gray-200 flex gap-2 text-red-500 justify-center items-center text-center'>
                                  <FaRegTrashAlt />
                                  Delete
                                </div>
                              }
                            </button>
                          }

                        </div>
                      </div>

                    </div>
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
          <PostModal modal={modal} toggleModal={toggleModal} user_id={session.user.id} setRefresh={setRefresh} refresh={refresh}/>
        </div>

        {confirmModal !== null && (
          <ConfirmDelete post_id={confirmModal} setConfirmModal={confirmModalFunc} deletePost={deletePost} />
        )}
      </>
      
    )
  );
};

export default Home;
