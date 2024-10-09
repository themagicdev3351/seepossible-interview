import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostList() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get(`/users/${id}/posts`, {
                headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
            });
            setPosts(response.data);
        };
        const fetchUser = async () => {
            const response = await axios.get(`/users/${id}`, {
                headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
            });
            setUser(response.data);
        };
        fetchPosts();
        fetchUser()
    }, [id]);

    if (!id) return

    return (
        <section className='dashboard_sec'>
            <div className="container">
                <h2>{user?.name}</h2>
                <div className='row mt-4'>
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <div className='col-md-4' key={post.id}>
                                <div className='card'>
                                    <div className='card-body'>
                                        <h5>{post.title}</h5>
                                        <p>{post.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No posts available</div>
                    )}

                </div>
            </div>
        </section>
    );
}

export default PostList;
