'use client'

import { useEffect, useState } from "react";
import PostModal from "./modal/PostModal";

export default function Main(){

    // fetch data from mongo db
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/data/posts')
                if (!response.ok) {
                  throw new Error('Failed to fetch posts');
                }
                const posts = await response.json();
                setPosts(posts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

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
                <PostModal header={1}/>
            </div>
        </div>
    )
}