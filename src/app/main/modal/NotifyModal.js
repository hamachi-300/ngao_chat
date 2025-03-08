"use client"

import React, { useEffect, useState } from "react";
import "./Modal.css";

export default function PostModal({ user, posts, comments }) {
    const [modal, setModal] = useState(false);  

    // Filter posts by the user
    const f_posts = posts.filter(post => post.author_id === user.user_id);
    const postIds = new Set(f_posts.map(post => post.post_id));  // Set of post IDs for fast lookup

    // Filter comments that belong to those posts
    const filteredComments = comments.filter(comment => postIds.has(comment.post_id) && comment.author_id != user.user_id);
    filteredComments.reverse();  // Reverse to show latest first

    const toggleModal = () => {
        setModal(!modal);
    };

    return (
    <>
        <button onClick={toggleModal}>
            Notify ({user.notify})
        </button>

        {modal && (
          <div className="modal">
                <div onClick={toggleModal} className="overlay"></div>
                <div className="modal-content">
                    <h2>Notification</h2>
                    <div>=============================================</div>
                    {filteredComments.map((comment) => (
                        <a href={`/comment/${comment.post_id}`} key={comment.comment_id}>
                            <div>  {/* Using comment_id instead of array index */}
                                <h3>{f_posts.find(post => post.post_id === comment.post_id)?.post_content || "Post not found"}</h3> {/* Ensure post exists */}
                                <h4>{comment.comment_content}</h4>
                                <div>------------------------------------------------------------</div>
                            </div>
                        </a>
                    ))}
                    <button onClick={toggleModal}>
                        close
                    </button>
                </div>
          </div>
        )}
    </>
    );
}
