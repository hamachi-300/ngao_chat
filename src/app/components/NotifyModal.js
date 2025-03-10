'use client';
import React, { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function NotifyModal({ session, update }) {
    if (!session) return null;
    const user_id = session.user.id
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    }

    const updateSession = async () => {
        try {
            console.log(user_id);
    
            // Await the fetch call
            const response = await fetch(`/api/data/users/${user_id}`);
    
            if (!response.ok) {
                throw new Error("Error while fetching user data");
            }
    
            // Wait for the response to be converted to JSON
            const userData = await response.json();

            session.user.notify = userData.notify
            
    
        } catch (error) {
            console.log("Error:", error);
        }
    };
    

    const getComments = async () => {
        try {
            const response = await fetch(`/api/data/comments/comments_filter/${user_id}`);

            if (!response.ok){
                throw new Error(`error while fetch comment of userId: ${user_id}`);
            }

            let commentsData = await response.json();

            setComments(commentsData);
            console.log(`fetch comment of userId: ${user_id} success!!`)
        } catch (error) {
            console.log("Error:", error);
        }
    }

    const getPosts = async () => {
        try {
            const response = await fetch(`/api/data/posts`);

            if (!response.ok){
                throw new Error(`error while fetch post`);
            }

            let postsData = await response.json();
            postsData = postsData.filter(post => post.author_id == user_id);
            setPosts(postsData);

            console.log(`fetch post success!!`)
        } catch (error) {
            console.log("Error:", error);
        }
    }

    const clearNotify = async () => {
        try {
            // Clear notify for the user
            await fetch(`/api/data/notify/reset_notify/${user_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(session.user),
            });

            // Clear comments for each comment in filteredComments
            for (const comment of comments) {
                const clearResponse = await fetch(`/api/data/notify/clear_comment/${comment.comment_id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(comment),
                });
                if (!clearResponse.ok) {
                    throw new Error(`Failed to clear comment with ID ${comment.comment_id}`);
                }
            }
            console.log("Clear comments complete!");
    
            // Reload the page after clearing notify and comments
            toggleModal();
            setRefresh(!refresh);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // fetch users posts comments
    useEffect(()=>{
        const fetch = async () => {
            await updateSession();
            await getComments();
            await getPosts();
        }
        fetch()
    }, [refresh]);

    return (
        <>
            <div 
                className="transition-all duration-250 text-3xl text-white hover:scale-110 hover:text-yellow-300 hover:drop-shadow-lg focus:outline-none cursor-pointer"
                onClick={() => toggleModal()}
            >
                {/* Notification icon or active state */}
                {console.log(session.user.notify)}
                {session.user.notify == null || session.user.notify === 0 ? (
                    <MdNotifications className="text-3xl" />
                ) : (
                    <MdNotificationsActive className="text-3xl text-yellow-500" />
                )}
            </div>

            {modal && (
                <div onClick={() => toggleModal()} className=" fixed inset-0 flex items-center justify-center z-50 bg-gray-800/70 bg-opacity-60">
                    <div
                        // stop another bubbling up event
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-xl shadow-2xl w-96 max-w-md bg-[#535C91]"
                    >
                        <div className="bg-[#1B1A55] rounded-t-lg p-5 text-2xl">
                            Notifications
                        </div>
                        <div className="bg-[#535C91] h-[300px] overflow-y-auto">
                            {
                                comments.map((comment, id) => (
                                    <div key={id}>
                                        <div className="hover:bg-[#74739C] bg-[#9290C3] duration-250 transition-all m-2.5 p-2.5 rounded-md cursor-pointer" 
                                            onClick={()=>{router.push(`/comment/${comment.post_id}`); toggleModal()}}
                                        >
                                            <div className="text-2xl text-left">
                                                {posts.find(post => post.post_id == comment.post_id)?.post_content || "Post content not found"}
                                            </div>
                                            <div className="ml-2 mt-1 text-lg text-left">
                                                {comment.comment_content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="bg-[#E43F5A] rounded-b-lg p-3 text-xl cursor-pointer hover:opacity-80  duration-250 transition-all" onClick={clearNotify}>
                            clear
                        </div>
                    </div>  
                </div>
            )}
        </>
    );
}
