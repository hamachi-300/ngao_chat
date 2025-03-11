'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import ConfirmDelete from '@/app/home/modal/ConfirmDelete';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";

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
    const [commentLiked, setCommentLiked] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const postId = params.post_id;

    

    const toggleDropdown = (postId) => {
        setOpenDropdown((prev) => (prev === postId ? null : postId));
    };

    const confirmModalFunc = (comment_id) => {
        setConfirmModal(comment_id);
    }

    const deleteComment = async (comment_id) => {
        try {
            const response = await fetch(`/api/data/comment/${comment_id}`, {
            method: 'DELETE',
            });
  
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
  
            setComments((prev) => prev.filter((comment) => comment.comment_id !== comment_id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

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
    }, [status, refresh]);


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
            const response = await fetch(`/api/data/comment`);
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
            const commentsWithUsername = commentsData.map(comment => { 
                
                if (comment.like.includes(session.user.id)) {
                    setCommentLiked((prev) => [...prev, comment.comment_id]);
                }
                
                return ({
                ...comment,
                username: userMap[comment.author_id] || `@${comment.author_id}`
            })});

            setComments(commentsWithUsername);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const submitComment = async () => {

        if (commentMessage.length > 0) {

            setLoading(true);

            const url = "/api/data/comment";
            const data = {
                post_id: parseInt(postId),
                author_id: session.user.id,
                comment_content: commentMessage
            };

            try {
                // increase notify for author post when it not post of author
                let response = [];
                if (session.user.id != post.author_id){
                    response = await fetch(`/api/data/notify/increase_notify/${author._id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(author),
                    });
                    if (!response.ok) {
                        throw new Error("Error while posting comment");
                    }
                }

                response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error("Error while posting comment");
                }

                setRefresh(!refresh);
                setCommentMessage("");
                setLoading(false);
            } catch (error) {
                console.log("Error:", error);
            }
        }
    };

    async function unlike() {

        post.like = post.like.filter(u => u !== session.user.id);

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

        post.like.push(session.user.id);

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

    async function unlikeComment(comment) {

        comment.like = comment.like.filter(u => u !== session.user.id);

        setCommentLiked((prev) => {
            let arr = prev.filter(p => p !== comment.comment_id);
            return arr;
        });

        try {
            const response = await fetch(`/api/data/comment/${comment.comment_id}`, {
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

    async function likeComment(comment) {

        comment.like.push(session.user.id);

        setCommentLiked((prev) => [...prev, comment.comment_id]);

        try {
            const response = await fetch(`/api/data/comment/${comment.comment_id}`, {
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
        if (status === "unauthenticated") {
            router.push('/login');
        }
    }, [status]);

    if (status === 'loading' || isLoading) {
        return <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>;
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-[#0c163d] w-200 min-h-screen relative pb-24">
                    <div className="w-full h-50 flex flex-col justify-between">
                        <div className='flex flex-col ml-15 m-4 mt-7 gap-1.5 text-blue-300 hover:text-blue-200 transition-all duration-250 text-sm'>
                            <button onClick={() => router.push("/home")}>
                                <div className='cursor-pointer flex items-center'>
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
                                    className={`cursor-pointer text-2xl hover:scale-110 ease-out transition-transform duration:150 
                                ${liked ? "text-red-500 scale-110" : "text-white scale-100"} 
                                ${liked && "animate-pulse"}`}>

                                    <AiOutlineHeart /></button>
                                <p className='flex items-center justify-cente'>{post.like.length}</p>
                            <span
                              className={`pl-2 pr-2 p-1 m-1 text-sm rounded-full text-gray-300 bg-[#535C91] `}
                            >
                              {post.category == "general" && (<FaComment className="inline mr-1"/>)}
                              {post.category == "love" && (<FaHeart className="inline mr-1" />)}
                              {post.category == "game" && (<FaGamepad className="inline mr-1" />)}
                              {post.category}
                            </span>
                            </div>
                            <p className="ml-1 text-gray-400 font-semibold text-xs w-fit inline">{author.username}</p>
                        </div>
                        <div className="flex justify-center">
                            <div className="h-1 w-11/12 bg-[#9290C3] rounded-full"></div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-10">
                        <ul className="space-y-6 flex flex-col items-center w-full">
                            {comments.map((comment, id) => (
                                <li key={id} id={`comment-${comment.comment_id}`} className="shadow-md flex justify-center w-full">
                                    <div className="w-11/12 max-w-[600px] flex flex-col justify-center gap-1.5">
                                        
                                        <div className='bg-[#9290C3] shadow-md rounded-md flex flex-col justify-between w-full'>
                                            <div className="flex justify-between">
                                                <div className="p-4">
                                                    <p className="mb-2 font-bold text-white">{comment.comment_content}</p>
                                                    <p className="ml-1 text-gray-300 font-semibold text-xs">{comment.username}</p>
                                                </div>
                                                <div className='text-[#e0e0e0] font-bold mt-2 mr-1 text-[1.25rem]'>
                                                    <CiMenuKebab onClick={() => toggleDropdown(comment.comment_id)} 
                                                    className='text-white cursor-pointer hover:text-gray-300 hover:scale-110 transition-all duration-150' 
                                                    />
                                                    <div className={`absolute text-xs right-26 mt-2 bg-white shadow-md rounded-md z-10 transition-all duration-200 ease-out transform ${openDropdown === comment.comment_id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                                        
                                                        { comment.author_id === session.user.id &&
                                                        <button 
                                                            className='py-1 rounded-md w-full text-left cursor-pointer'
                                                        >
                                                            {
                                                            <div onClick={() => setConfirmModal(comment.comment_id)} className=' px-4 py-1 hover:bg-gray-200 flex gap-2 text-red-500 justify-center items-center text-center'>
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
                                        
                                        
                                        <div className="flex gap-4">
                                            <div className="flex gap-1.5">
                                                <button onClick={() => {
                                                    commentLiked.includes(comment.comment_id) ? unlikeComment(comment) : likeComment(comment)
                                                }} className={`cursor-pointer text-2xl hover:scale-110 ease-out transition-transform duration:150 
                                                ${commentLiked.includes(comment.comment_id) ? "text-red-500 scale-110" : "text-white scale-100"} 
                                                ${commentLiked.includes(comment.comment_id) && "animate-pulse"}`}>

                                                    <AiOutlineHeart />

                                                </button>
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
                            className="cursor-pointer p-3 bg-[#615FFF] text-2xl hover:bg-[#8d8bff] transition-all duration-250 text-white font-semibold rounded-r-2xl"
                            onClick={submitComment}
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>

            {confirmModal !== null && (
                <ConfirmDelete post_id={confirmModal} setConfirmModal={confirmModalFunc} deletePost={deleteComment} />
            )} 
        </>
    );
}
