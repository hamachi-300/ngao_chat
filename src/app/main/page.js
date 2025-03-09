'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import PostModal from "./modal/PostModal";

export default function Main(){

    // login page send user email
    const cur_email = "sirawut@gmail.com";

    // fetch data from mongo db
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState({});
    const router = useRouter();

    const getPosts = async () => {
        const response = await fetch('/api/data/posts')
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        setPosts(posts);
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
                <li>;-;</li>
                <li>Ngao Ngao</li>
                <li>Profile</li>
            </ul>
            <div>=====================================================================</div>
            <div id="content">
                {
                    posts.map((post, id) => (
                        <div key={id}>
                            {post.post_content}
                            <button>like {post.like}</button>
                            <button>comment</button>
                        </div>
                    ))
                }
            </div>
            <div>=====================================================================</div>
            <div id="sticky-buttons">
                <button>notification</button>
                <PostModal user_id={curUser.user_id}/>
            </div>
        </div>
    )
}