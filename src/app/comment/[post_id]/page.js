'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileModal from "../../main/modal/ProfileModal";

export default function Page({}) {
    const cur_email = "patigg@gmail.com"; // current user's email
    const router = useRouter(); // for navigation
    const params = useParams(); // get params to client component
    const postId = params.post_id; // Post ID from URL params

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState({});
    const [comment, setComment] = useState("");
    const [author, setAuthor] = useState({});

    const getUsers = async () => {
        const response = await fetch('/api/data/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        const cur_user = users.find(u => u.email === cur_email);
        if (cur_user == null) {
            router.push("/login"); // Redirect to login if the user is not found
        } else {
            setCurUser(cur_user);
        }
    };

    const getPost = async () => {
        try {
            let response = await fetch(`/api/data/posts/${postId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch post");
            }
            const postData = await response.json();
            setPost(postData);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    const getAuthor = async () => {
        try {
            const response = await fetch(`/api/data/users/${post.author_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch author");
            }
            const authorData = await response.json();
            setAuthor(authorData);
        } catch (error) {
            console.error("Error fetching author:", error);
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
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    const submitComment = async () => {
        const url = "/api/data/comments";
        const data = {
            post_id: parseInt(postId),
            author_id: curUser.user_id,
            comment_content: comment
        };
        try {
            if (curUser.user_id !== post.author_id) {
                const notifyUrl = `/api/data/users/increase_notify/${post.author_id}`;
                const dataAuthor = {
                    user_id: author.user_id,
                    email: author.eamil,
                    profile_id: author.profile_id,
                    notify: author.notify
                }
                const response = await fetch(notifyUrl, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataAuthor)
                });

                if (!response.ok) {
                    throw new Error("Failed to update notify");
                }
            }
            // const response = await fetch(url, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(data)
            // });

            if (!response.ok) {
                throw new Error("Error while posting comment");
            }

            const result = await response.json();
            console.log('Data posted successfully:', result);

            // Instead of reload, update the state to re-render the page with the new comment
            setComments((prevComments) => [result, ...prevComments]);
            setComment(""); // Clear the input after submission
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getUsers();
            await getPost();
            await getComments();
            setLoading(false);
        };
        fetchData();
    }, [postId]);
    
    useEffect(() => {
        const fetchData = async () => {
            await getAuthor();
        }
        if (post.author_id) {
            fetchData();
        }
    }, [post.author_id]);

    if (isLoading) return <div>Loading...</div>;

    console.log(author)

    return (
        <div>
            <ul id="nav-bar">
                <li><a href="/main">;-;</a></li>
                <li>Comment</li>
                <li><ProfileModal user={curUser} /></li>
            </ul>
            <div>=====================================================================</div>
            <p>{post.post_content}</p>
            <p>Likes: {post.like}</p>
            <div>=====================================================================</div>
            <h3>Comments</h3>
            {comments.length > 0 ? (
                comments.map((comment, id) => (
                    <div key={id}>
                        ----------------------------------------
                        <p>{comment.comment_content}</p>
                        <p>Likes: {comment.like}</p>
                    </div>
                ))
            ) : (
                <div>No comments yet.</div>
            )}
            <div className="post-comment">
                <input
                    type="text"
                    placeholder="Comment something..."
                    value={comment}
                    onChange={handleComment}
                />
                <button onClick={submitComment}>&#8594;</button>
            </div>
        </div>
    );
}
