import React, { useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/conf';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostForm({ post }) {
    const methods = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    });

    const { handleSubmit, watch, setValue, register } = methods;
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        console.log('Form submitted with data:', data);
        
        // Check if user is authenticated
        if (!userData || !userData.$id) {
            console.error('User not authenticated');
            navigate('/login');
            return;
        }
        
        try {
            if (post) {
                // Existing post - update
                const file = data.image?.[0] 
                    ? await appwriteService.uploadFile(data.image[0]) 
                    : null;

                if (file) {
                    // Delete old image if a new one is uploaded
                    if (post.featuredImage) {
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                }
                
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage,
                });
                
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // New post - create
                if (!data.image?.[0]) {
                    alert('Please select a featured image');
                    return;
                }
                
                const file = await appwriteService.uploadFile(data.image[0]);
                
                if (file) {
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        featuredImage: file.$id,
                        userid: userData.$id, // Using userid to match the parameter name in createPost
                        status: data.status || 'active',
                    });
                    
                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            alert(`Error: ${error.message || 'Failed to save post'}`);
        }
    };

    const slugTransform = useCallback(
        (value) => {
            if (value && typeof value === 'string') {
                return value
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/--+/g, '-');
            }
            return '';
        },
        []
    );

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title' && value.title) {
                setValue('slug', slugTransform(value.title), {
                    shouldValidate: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-2/3 px-2">
                    <Input
                        label="Title:"
                        placeholder="Title"
                        className="mb-4"
                        {...register('title', { required: true })}
                    />
                    <Input
                        label="Slug:"
                        placeholder="Slug"
                        className="mb-4"
                        {...register('slug', { required: true })}
                        onInput={(e) => {
                            setValue('slug', slugTransform(e.target.value), {
                                shouldValidate: true,
                            });
                        }}
                    />
                    <RTE 
                        label="Content:" 
                        name="content" 
                        defaultValue={post?.content || ''} 
                    />
                </div>
                <div className="w-1/3 px-2">
                    <Input
                        label="Featured Image:"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register('image', { required: !post })}
                    />
                    {post && (
                        <div className="mb-4 w-full">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg w-full h-auto"
                            />
                        </div>
                    )}
                    <Select
                        options={['active', 'inactive']}
                        label="Status"
                        className="mb-4"
                        {...register('status', { required: true })}
                    />
                    <Button
                        type="submit"
                        bgColor={post ? 'bg-green-500' : undefined}
                        className="w-full"
                    >
                        {post ? 'Update' : 'Submit'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default PostForm;