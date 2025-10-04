import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/conf";
import { Link } from 'react-router-dom';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await appwriteService.getPosts();
                if (response && response.documents) {
                    console.log('All Posts Data:', response.documents);
                    setPosts(response.documents);
                } else {
                    setError('Failed to load posts');
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='mb-8 flex justify-between items-center'>
                    <h1 className='text-3xl font-bold'>All Posts</h1>
                    <Link to="/add-post" className='bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors'>
                        Create Post
                    </Link>
                </div>
                
                {posts.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {posts.map((post) => {
                            const { $id, title, featuredImage, content, userId } = post;
                            return (
                                <div key={$id} className="h-full">
                                    <div key={$id} className="h-full">
                                        <PostCard 
                                            $id={$id}
                                            title={title}
                                            featuredImage={featuredImage}
                                            content={content || ''}
                                            userId={userId}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <h2 className='text-2xl font-semibold text-gray-600 mb-4'>No Posts Found</h2>
                        <p className='text-gray-500 mb-6'>Be the first to create a post!</p>
                        <Link 
                            to="/add-post" 
                            className='inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors'
                        >
                            Create Your First Post
                        </Link>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default AllPosts;