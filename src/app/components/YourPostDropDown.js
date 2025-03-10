"use client";

import { IoEarthSharp } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

export default function YourPost() {
    const { data: session, status } = useSession();
    const [enable, setEnable] = useState(false);
    const [posts, setPosts] = useState([]);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

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

    useEffect(() => {
        getPosts();
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
            postElement.scrollIntoView({ behavior: "smooth", block: "start" });
            setEnable(false); // Close the dropdown after selection
        }
    };

    return (
        <>
            <div 
                ref={buttonRef}
                className="relative group">
                {/* Button with hover description */}
                <div
                    className="text-white text-2xl hover:scale-110 hover:text-green-300 duration-150 transition-all shadow-md cursor-pointer"
                    onClick={toggleDropdown} // Toggle dropdown visibility on click
                >
                    <IoEarthSharp />
                </div>

                {/* Hover text (tooltip) */}
                <div
                    style={{ draggable: false }}
                    className="text-xs absolute left-1/2 w-20 transform -translate-x-1/2 mt-2 p-2 bg-[#0000008d] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                    <p className="text-center">Your Posts</p>
                </div>
            </div>

            {/* Dropdown Menu with top-to-bottom wipe transition */}
            <div
                ref={dropdownRef}
                className={`absolute left-1/2 w-100 transform -translate-x-full mt-5 p-2
                    bg-[#9e97ff] bg-opacity-90 border-[#070F2B] border-4 rounded-3xl
                    text-white transition-all duration-250 ${enable ? "opacity-100" : "opacity-0"
                    } pointer-events-auto`}
            // bg-gradient-to-br from-[#27f4ff] via-[#4f34ff] to-[#9b30ff]
            // style={{ background: 'linear-gradient(to bottom right, rgba(39, 244, 180, 0.7), rgba(79, 52, 180, 0.7), rgba(155, 48, 180, 0.7))' }}
            >
                {/* Add your dropdown content here */}
                <div className="flex flex-col justify-center items-center gap-4">
                    <div className="flex flex-col justify-center items-center w-full gap-3">
                        <p style={{ textShadow: '0px 2px 2px rgba(0,0,0,0.5)' }} className="font-bold text-center mt-2.5">Your Posts</p>
                        <div className="w-[90%] bg-[#b2f0ff] h-1 rounded-full"></div>
                    </div>
                    <div className="flex flex-col w-full">
                        <ul className="pr-1.5 space-y-2.5 overflow-auto max-h-[400px] scrollbar-custom">
                            {posts.map((posts, id) => (
                                <li key={id} onClick={() => scrollToPost(posts.post_id)} className="cursor-pointer">
                                    <div className="flex gap-1 bg-[#00000058] hover:bg-[#0000008b] transition-color duration-150 rounded shadow-md">
                                        <div className="rounded-l bg-gray-200 min-w-1 w-1"></div>
                                        <div className="flex flex-col">
                                            <p className="pl-3 pt-2 pb-1">{posts.post_content}</p>
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
                    </div>
                </div>
            </div>
        </>
    );
}
