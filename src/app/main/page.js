'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import PostModal from "./modal/PostModal";
import ProfileModal from "./modal/ProfileModal"
import NotifyModal from "./modal/NotifyModal"


export default function Main(){

    // login page send user email
    const cur_email = "sirawut@gmail.com"

    // fetch data from mongo db
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState({});
    const [comments, setComment] = useState([]);
    const router = useRouter();

    const getPosts = async () => {
        const response = await fetch('/api/data/posts')
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        setPosts(posts);
    }

    const getComments = async () => {
        const response = await fetch('/api/data/comments')
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        let comments = await response.json();
        setComment(comments);
    }

    const getUsers = async () => {
        const response = await fetch('/api/data/users')
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        const cur_user = users.find(u => u.email === cur_email);
        if (cur_user == null){
            router.push("/login");
        } else {
            setCurUser(cur_user);
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                await getPosts();
                await getComments();
                await getUsers();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // refresh web page when got current user info
    useEffect(() => {

    }, [curUser]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <ul id="nav-bar">
                <li><a href="/main">;-;</a></li>
                <li>Ngao Ngao</li>
                <li><ProfileModal user={curUser}/></li>
            </ul>
            <div>=====================================================================</div>
            <div id="content">
                {
                    posts.map((post, id) => (
                        <div key={id}>
                            {post.post_content}
                            <button>like {post.like}</button>
                            <a href={`comment/${post.post_id}`}>
                                <button>comment</button>
                            </a>
                        </div>
                    ))
                }
            </div>
            <div>=====================================================================</div>
            <div id="sticky-buttons">
                <NotifyModal user={curUser} posts={posts} comments={comments}/>
                <PostModal user_id={curUser.user_id}/>
            </div>
        </div>
    )
}