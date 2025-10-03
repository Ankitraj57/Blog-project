import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/conf';
import {Button, Container} from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {slug} = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userid === userData.$id : false;
    
    // // Debug logs
    // console.log('User Data:', userData);
    // console.log('Post Data:', post);
    // console.log('Is Author:', isAuthor);

    useEffect(() => {
        if (!slug) {
            navigate('/');
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const postData = await appwriteService.getPost(slug);
                if (postData) {
                    setPost(postData);
                } else {
                    setError('Post not found');
                    setTimeout(() => navigate('/'), 2000);
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if(status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate('/');
            }
        });
    };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error} {error === 'Post not found' && 'Redirecting to home page...'}
        </div>
      </div>
    );
  }

  return post ? (
    <div className='py-8'>
        <Container>
            <div className='w-full flex justify-center mb-4 relative border rounded-xl p-2'>
                <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title}
                className='rounded-xl'
                />
                {isAuthor && (
                    <div className='absolute right-6 top-6'>
                        <Link to={`/edit-post/${post.$id}`}>
                        <Button 
                          bgColor="bg-green-500"
                          className="mr-3 text-black hover:bg-green-600"
                        >
                          Edit
                        </Button>
                        </Link>
                        <Button 
                          bgColor='bg-red-500'
                          className="text-white hover:bg-red-600"
                          onClick={deletePost}
                        >
                          Delete
                        </Button>
                    </div>
                )}
            </div>
            <div className='w-full mb-6'>
                <h1 className='text-2xl font-bold'>
                    {post.title}
                </h1>
            </div>
            <div className='browser-css'>
                {parse(post.content)}
            </div>
        </Container>
    </div>
  ) : null;
}

