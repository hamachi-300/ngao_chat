'use client';
import React, { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";

export default function NotifyModal({ session }) {
    if (!session) return null;
    const user_id = session.user.id
    const [modal, setModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const toggleModal = () => {
        setModal(!modal);
    }

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
            // // Clear notify for the user
            // fetch(`/api/data/reset_notify/${user.user_id}`);
            // console.log("Clear notify is successful");
    
            // // Clear comments for each comment in filteredComments
            // for (const comment of filteredComments) {
            //     const clearResponse = await fetch(`/api/data/clear_comment/${comment.comment_id}`);
            //     if (!clearResponse.ok) {
            //         throw new Error(`Failed to clear comment with ID ${comment.comment_id}`);
            //     }
            // }
            // console.log("Clear comments complete!");
    
            // // Reload the page after clearing notify and comments
            toggleModal();
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // fetch users posts comments
    useEffect(()=>{
        const fetch = async () => {
            await getComments();
            await getPosts();
        }
        fetch()
    }, []);

    return (
        <>
            <div 
                className="transition-all duration-250 text-3xl text-white hover:scale-110 hover:text-yellow-300 hover:drop-shadow-lg focus:outline-none cursor-pointer"
                onClick={() => toggleModal()}
            >
                {/* Notification icon or active state */}
                {session.user.notify == null ? (
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
                        <div className="bg-[#535C91] rounded-lg p-5 h-[300px] overflow-y-auto">
                            {
                                comments.map((comment, id) => (
                                    <div className="pb-5" key={id}>
                                        <div className="text-2xl text-left">
                                            {posts.find(post => post.post_id == comment.post_id)?.post_content || "Post content not found"}
                                        </div>
                                        <div className="text-lg text-left m-2">
                                            {comment.comment_content}
                                        </div>
                                        <div className="h-2 w-20/20 bg-[white] rounded-full"></div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="bg-[#E43F5A] rounded-b-lg p-3 text-xl cursor-pointer hover:opacity-80" onClick={clearNotify}>
                            clear
                        </div>
                    </div>  
                </div>
            )}
        </>
    );
}
