'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";

export default function Page({ }) {

    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [author, setAuthor] = useState({});
    const [comments, setComments] = useState([]);
    const [commentMessage, setCommentMessage] = useState("");
    const [liked, setLiked] = useState(false);
    const postId = params.post_id;

    const getPost = async () => {

        if (status === 'authenticated') {

            try {
                let response = await fetch(`/api/data/posts/${postId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch post");
                }
                const postData = await response.json();

                setPost(postData);

                setLiked(postData.like.includes(session.user.id));

                await getAuthor(postData);
                await getComments();
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        }
    };

    useEffect(() => {
        getPost();
    }, [status]);

    useEffect(() => {
        getComments();
    }, [isLoading])


    const getAuthor = async (post) => {
        try {

            const response = await fetch(`/api/data/user/users/${post.author_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch author");
            }
            const authorData = await response.json();
            setAuthor(authorData);

            setLoading(false);
        } catch (error) {
            //console.error("Error fetching author:", error);
        }
    };

    const getComments = async () => {
        try {
            const response = await fetch(`/api/data/comments`);
            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }
    
            let commentsData = await response.json();
            commentsData = commentsData.filter(comment => comment.post_id == postId);
    
            // Extract all unique author IDs from comments
            const authorIds = [...new Set(commentsData.map(comment => comment.author_id))];

            // Fetch all usernames based on the author IDs
            const authorResponse = await fetch(`/api/data/user/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ author_ids: authorIds })
            });
    
            if (!authorResponse.ok) {
                throw new Error("Failed to fetch usernames");
            }
    
            const authorData = await authorResponse.json();
    
            // Create a map of user IDs to usernames
            const userMap = authorData.reduce((map, user) => {
                map[user.id] = user.username;
                return map;
            }, {});
    
            // Map the comments with the correct username
            const commentsWithUsername = commentsData.map(comment => ({
                ...comment,
                username: userMap[comment.author_id] || `@${comment.author_id}`
            }));
    
            setComments(commentsWithUsername);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const submitComment = async () => {

        if (commentMessage.length > 0) {

            setLoading(true);

            const url = "/api/data/comments";
            const data = {
                post_id: parseInt(postId),
                author_id: session.user.id,
                comment_content: commentMessage
            };
            try { 
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error("Error while posting comment");
                }

                setCommentMessage("");
                setLoading(false);
            } catch (error) {
                console.log("Error:", error);
            }
        }
    };

    async function unlike() {

    setLiked(!liked);
    
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

  async function like() {

    setLiked(!liked);

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


    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading' || isLoading) {
        return <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-[#0c163d] w-200 min-h-screen relative pb-24">
                <div className="w-full h-50 flex flex-col justify-between">
                    <div className='flex flex-col ml-15 m-4 mt-7 gap-1.5 text-blue-300 hover:text-blue-200 transition-all duration-250 text-sm'>
                        <button onClick={() => router.push("/home")}>
                            <div className='flex items-center'>
                                <IoCaretBackOutline /> 
                                Back
                            </div>
                        </button>
                        <p className=" text-white font-semibold text-3xl">{post.post_content}</p>
                    </div>
                    
                    <div className="flex flex-col ml-15 m-4 gap-2">
                        <div className="flex gap-1.5">
                            <button onClick={() => {
                                liked ? unlike() : like()
                            }} 
                            className={`text-2xl hover:scale-110 ease-out transition-transform duration:150 
                            ${liked ? "text-red-500 scale-110" : "text-white scale-100"} 
                            ${liked && "animate-pulse"}`}>
                                
                                <AiOutlineHeart /></button>
                            <p>{post.like.length}</p>
                        </div>
                        <p className="ml-1 text-gray-400 font-semibold text-xs">{author.username}</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="h-1 w-11/12 bg-[#9290C3] rounded-full"></div>
                    </div>
                </div>

                <div className="flex justify-center mt-10">
                    <ul className="space-y-6 flex flex-col items-center w-full">
                        {comments.map((comment, id) => (
                            <li key={id} className="shadow-md flex justify-center w-full">
                                <div className="w-11/12 max-w-[600px] flex flex-col justify-center gap-1.5">
                                    <div className="bg-[#9290C3] p-4 shadow-md rounded-md flex flex-col justify-between w-full">
                                        <p className="mb-2 font-bold text-white">{comment.comment_content}</p>
                                        <p className="ml-1 text-gray-300 font-semibold text-xs">{comment.username}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex gap-1.5">
                                            <button className="text-2xl"><AiOutlineHeart /></button>
                                            <p>{comment.like.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fixed Reply Button */}
                <div 
                    className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex bg-[#E5E7EB] w-11/12 max-w-[600px] rounded-2xl shadow-md"
                    style={{ zIndex: 10 }}
                >
                    <input 
                        type="text" 
                        placeholder="Write a reply..." 
                        className="flex-1 p-3 bg-transparent text-[#070F2B] outline-none rounded-l-2xl"
                        value={commentMessage || ""}
                        onChange={(e) => setCommentMessage(e.target.value)}
                    />
                    <button 
                        className="p-3 bg-[#615FFF] text-2xl hover:bg-[#8d8bff] transition-all duration-250 text-white font-semibold rounded-r-2xl"
                        onClick={submitComment}
                    >
                        <FiSend />
                    </button>
                </div>
            </div>
        </div>

    );

    // const cur_email = "sirawut@gmail.com"; // current user's email
    // const router = useRouter(); // for navigation
    // const params = useParams(); // get params to client component
    // const postId = params.post_id; // Post ID from URL params

    // const [post, setPost] = useState({});
    // const [comments, setComments] = useState([]);
    // const [isLoading, setLoading] = useState(true);
    // const [curUser, setCurUser] = useState({});
    // const [comment, setComment] = useState("");
    // const [author, setAuthor] = useState({});

    // const getUsers = async () => {
    //     const response = await fetch('/api/data/users');
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch users');
    //     }
    //     const users = await response.json();
    //     const cur_user = users.find(u => u.email === cur_email);
    //     if (cur_user == null) {
    //         router.push("/login"); // Redirect to login if the user is not found
    //     } else {
    //         setCurUser(cur_user);
    //     }
    // };

    // const getPost = async () => {
    //     try {
    //         let response = await fetch(`/api/data/posts/${postId}`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch post");
    //         }
    //         const postData = await response.json();
    //         setPost(postData);
    //     } catch (error) {
    //         console.error("Error fetching post:", error);
    //     }
    // };

    // const getAuthor = async () => {
    //     try {
    //         const response = await fetch(`/api/data/users/${post.author_id}`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch author");
    //         }
    //         const authorData = await response.json();
    //         setAuthor(authorData);
    //     } catch (error) {
    //         console.error("Error fetching author:", error);
    //     }
    // };

    // const getComments = async () => {
    //     try {
    //         const response = await fetch(`/api/data/comments`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch comments");
    //         }
    //         let commentsData = await response.json();
    //         commentsData = commentsData.filter(comment => comment.post_id == postId);
    //         setComments(commentsData);
    //     } catch (error) {
    //         console.error("Error fetching comments:", error);
    //     }
    // };

    // const handleComment = (event) => {
    //     setComment(event.target.value);
    // };

    // const submitComment = async () => {
    //     const url = "/api/data/comments";
    //     const data = {
    //         post_id: parseInt(postId),
    //         author_id: curUser.user_id,
    //         comment_content: comment
    //     };
    //     try {
    //         if (curUser.user_id !== post.author_id) {
    //             const notifyUrl = `/api/data/increase_notify/${author.user_id}`;
    //             console.log(notifyUrl);
    //             const dataAuthor = {
    //                 notify: author.notify
    //             }
    //             const response = await fetch(notifyUrl, {
    //                 method: "PATCH",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(dataAuthor)
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Failed to update notify");
    //             }
    //         }
    //         const response = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(data)
    //         });

    //         if (!response.ok) {
    //             throw new Error("Error while posting comment");
    //         }

    //         const result = await response.json();
    //         console.log('Data posted successfully:', result);

    //         // Instead of reload, update the state to re-render the page with the new comment
    //         setComments((prevComments) => [result, ...prevComments]);
    //         setComment(""); // Clear the input after submission
    //     } catch (error) {
    //         console.log("Error:", error);
    //     }
    // };

    // const increaseLike = async (comment) => {
    //     const likeUrl = `/api/data/like/comment/${comment.comment_id}`;

    //     try {

    //         // Now send the updated like count to the server
    //         const dataLike = {
    //             like: comment.like
    //         };

    //         const response = await fetch(likeUrl, {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(dataLike)
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to update like");
    //         }

    //         console.log("Like increased successfully!");

    //         window.location.reload();

    //         // Optionally, you can fetch the updated comment data again or update the local state if you're managing it
    //     } catch (error) {
    //         console.error("Error increasing like:", error);
    //     }
    // };

    // const increaseLikePost = async (post) => {
    //     const likeUrl = `/api/data/like/post/${post.post_id}`;

    //     try {

    //         // Now send the updated like count to the server
    //         const dataLike = {
    //             like: post.like
    //         };

    //         const response = await fetch(likeUrl, {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(dataLike)
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to update like");
    //         }

    //         console.log("Like increased successfully!");

    //         window.location.reload();

    //     } catch (error) {
    //         console.error("Error increasing like:", error);
    //     }
    // };


    // useEffect(() => {
    //     const fetchData = async () => {
    //         await getUsers();
    //         await getPost();
    //         await getComments();
    //         setLoading(false);
    //     };
    //     fetchData();
    // }, [postId]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await getAuthor();
    //     }
    //     if (post.author_id) {
    //         fetchData();
    //     }
    // }, [post.author_id]);

    // if (isLoading) return <div>Loading...</div>;

    // console.log(author)

    // return (



    //     // <div>
    //     //     <ul id="nav-bar">
    //     //         <li><a href="/main">;-;</a></li>
    //     //         <li>Comment</li>
    //     //         <li><ProfileModal user={curUser} /></li>
    //     //     </ul>
    //     //     <div>=====================================================================</div>
    //     //     <p>{post.post_content}</p>
    //     //     <button onClick={() => increaseLikePost(post)}>Likes: {post.like}</button>
    //     //     <div>=====================================================================</div>
    //     //     <h3>Comments</h3>
    //     //     {comments.length > 0 ? (
    //     //         comments.map((comment, id) => (
    //     //             <div key={id}>
    //     //                 ----------------------------------------
    //     //                 <p>{comment.comment_content}</p>
    //     //                 <button onClick={() => increaseLike(comment)}>Likes: {comment.like}</button>
    //     //             </div>
    //     //         ))
    //     //     ) : (
    //     //         <div>No comments yet.</div>
    //     //     )}
    //     //     <div className="post-comment">
    //     //         <input
    //     //             type="text"
    //     //             placeholder="Comment something..."
    //     //             value={comment}
    //     //             onChange={handleComment}
    //     //         />
    //     //         <button onClick={submitComment}>&#8594;</button>
    //     //     </div>
    //     // </div>
    // );
}
