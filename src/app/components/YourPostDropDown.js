"use client";

import { IoEarthSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaRegCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function YourPost() {
    const { data: session, status } = useSession();
    const [enable, setEnable] = useState(false);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [active, setActive] = useState("Posts");
    const router = useRouter();

    const getPosts = async () => {

        if (status === 'authenticated') {
            try {

                const response = await fetch(`/api/data/profile/posts/${session.user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }


                let postsData = await response.json();

                const commentCounts = await Promise.all(
                    postsData.map(async (post) => {

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

                const p = postsData.map(post => ({
                    ...post,
                    commentCount: commentCountMap[post.post_id] || 0
                }));

                setPosts(p);



            } catch (error) {
                throw new Error(error);
            }
        }
    }

    const getComments = async () => {
        if (status === 'authenticated') {
            try {

                const response = await fetch(`/api/data/profile/comments/${session.user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                let commentsData = await response.json();

                const postContentMap = await Promise.all(
                    commentsData.map(async (comment) => {
                        const postRes = await fetch(`/api/data/posts/${comment.post_id}`);

                        if (!postRes.ok) {
                            throw new Error('Failed to fetch posts');
                        }

                        let postData = await postRes.json();

                        return {
                            comment_id: comment.comment_id,
                            post_content: postData.post_content
                        }

                    })
                );

                const postsContent = postContentMap.reduce((map, { comment_id, post_content }) => {
                    map[comment_id] = post_content;
                    return map;
                }, {});

                const p = commentsData.map(comment => ({
                    ...comment,
                    post_content: postsContent[comment.comment_id] || ""
                }));

                setComments(p);
                

            } catch (error) {
                throw new Error(error);
            }
        }
    }

    useEffect(() => {
        getPosts();
        getComments();
    }, [status]);

    // Toggle dropdown visibility on click
    const toggleDropdown = () => {
        setEnable((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (
            buttonRef.current && !buttonRef.current.contains(event.target) &&
            dropdownRef.current && !dropdownRef.current.contains(event.target)
        ) {
            setEnable(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const scrollToPost = (post_id) => {
        const postElement = document.getElementById(`post-${post_id}`);
    
        if (postElement) {
            // If the post exists on the page, scroll to it smoothly
            postElement.scrollIntoView({ behavior: "smooth", block: "center" });
            setEnable(false); // Close dropdown
        } else {
            // If not on the posts page, navigate there and then scroll
            router.push(`/home#post-${post_id}`);
            setEnable(false);
        }
    }

    const scrollToComment = (post_id, comment_id) => {
        const commentElement = document.getElementById(`comment-${comment_id}`);

        if (commentElement) {
            commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
            setEnable(false);
        } else {
            router.push(`/comment/${post_id}#comment-${comment_id}`);
            setEnable(false);
        }
    };

    return (
        <>
            <div 
                ref={buttonRef}
                className="relative group">
                <div
                    className="text-white text-2xl hover:scale-110 hover:text-green-300 duration-150 transition-all shadow-md cursor-pointer"
                    onClick={toggleDropdown} // Toggle dropdown visibility on click
                >
                    <IoEarthSharp />
                </div>

                <div
                    style={{ draggable: false }}
                    className="text-xs absolute left-1/2 w-20 transform -translate-x-1/2 mt-2 p-2 bg-[#0000008d] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                    <p className="text-center">Your Posts</p>
                </div>
            </div>

            <div
                ref={dropdownRef}
                className={`absolute left-1/2 w-100 transform -translate-x-full mt-5
                    bg-[#9e97ff] bg-opacity-90 border-[#070F2B] border-4 rounded-3xl
                    text-white transition-all duration-250 ${enable ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="bg-[#7775ff] rounded-t-3xl flex flex-col justify-center items-center w-full gap-3 p-3 shadow-md">
                        <p
                            style={{ textShadow: "0px 2px 2px rgba(0,0,0,0.5)" }}
                            className="font-bold text-center"
                        >
                            Your Posts
                        </p>
                        <div className="w-[80%] bg-[#aaf5ff] h-0.5 rounded-full mb-1 shadow-xl"></div>

                        <div className="relative flex w-[80%] bg-[#00000038] h-5 mb-1 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 h-full bg-[#ffffff70] rounded-full shadow-md transition-all duration-300 ${
                                    active === "Posts" ? "left-0 w-[50%]" : "left-[50%] w-[50%]"
                                }`}
                            ></div>

                            <button
                                onClick={() => setActive("Posts")}
                                className="relative w-[50%] text-center text-xs z-10"
                            >
                                Posts
                            </button>

                            <button
                                onClick={() => setActive("Comments")}
                                className="relative w-[50%] text-center text-xs z-10"
                            >
                                Comments
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col w-full">
                        {active === "Posts" ? (
                            <ul className="m-2 pr-1.5 space-y-2.5 overflow-auto max-h-[400px] scrollbar-custom">
                            {posts.map((posts, id) => (
                                <li key={id} onClick={() => scrollToPost(posts.post_id)} className="cursor-pointer">
                                    <div className="flex gap-1 bg-[#00000058] hover:bg-[#0000008b] transition-color duration-150 rounded shadow-md">
                                        <div className="rounded-l bg-gray-200 min-w-1 w-1"></div>
                                        <div className="flex flex-col overflow-x-hidden">
                                            <p className="pl-3 pt-2 pb-1 max-w-full">{posts.post_content}</p>
                                            <div className="flex gap-0.5">
                                                <div className="pl-3 pb-2 pt-1 flex gap-1.5 items-center text-sm text-center">
                                                    <AiOutlineHeart />
                                                    <p>{posts.like.length}</p>
                                                </div>
                                                <div className="pl-3 pb-2 pt-1 flex gap-1.5 items-center text-sm text-center">
                                                    <FaRegComment />
                                                    <p>{posts.commentCount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        ) : (
                            <ul className="m-2 pr-1.5 space-y-2.5 overflow-auto max-h-[400px] scrollbar-custom">
                            {comments.map((comment, id) => (
                                <li key={id} onClick={() => scrollToComment(comment.post_id, comment.comment_id)} className="cursor-pointer">
                                    <div className="flex gap-1 bg-[#00000058] hover:bg-[#0000008b] transition-color duration-150 rounded shadow-md">
                                        <div className="rounded-l bg-gray-200 min-w-1 w-1"></div>
                                        <div className="flex flex-col overflow-x-hidden">
                                            <p className="pl-3 pt-2 pb-1">{comment.comment_content}</p>
                                            <div className="flex min-w-90 justify-between">
                                                <div className="pl-3 pb-2 pt-1 flex gap-1.5 items-center text-sm text-center">
                                                    <FaRegCommentDots />
                                                    <p>{comment.post_content}</p>
                                                </div>
                                                <div className="pr-3 pb-2 pt-1 flex gap-1.5 items-center text-sm text-gray-300 text-center">
                                                    <AiOutlineHeart />
                                                    <p>{comment.like.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
