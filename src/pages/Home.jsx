import React, {useState, useEffect} from 'react'
import appwriteService from '../appwrite/conf'
import { Container, PostCard } from '../components'


function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if(posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-gray-500'>
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => {
                        const { $id, title, featuredImage, content, userId } = post;
                        return (
                            <div key={$id} className='p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                                <PostCard 
                                    $id={$id}
                                    title={title}
                                    featuredImage={featuredImage}
                                    content={content || ''}
                                    userId={userId}
                                />
                            </div>
                        );
                    })}
                </div>
            </Container>
        </div>
    )
}

export default Home