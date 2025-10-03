import React, { useState, useEffect } from 'react';
import appwriteService from "../appwrite/conf";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostCard({ $id, title, featuredImage, content, userId, className = '' }) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userData = useSelector(state => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user is the author of the post
    if (userData && userId === userData.$id) {
      setIsAuthor(true);
    }
  }, [userData, userId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        // Delete the post
        await appwriteService.deletePost($id);
        // Delete the featured image if it exists
        if (featuredImage) {
          await appwriteService.deleteFile(featuredImage);
        }
        // Refresh the page to see the changes
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
        setIsDeleting(false);
      }
    }
  };
  
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col ${className}`}>
      <div className="relative">
        {/* Edit and Delete Buttons - Only show if user is the author */}
        {isAuthor && (
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            <Link 
              to={`/edit-post/${$id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-colors"
              title="Edit Post"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors disabled:opacity-50"
              title="Delete Post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        
        <Link to={`/post/${$id}`} className="block h-full">
          <div className="relative h-52 overflow-hidden">
            <img 
              src={appwriteService.getFilePreview(featuredImage)} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {title}
            </h2>
            
            {content && (
              <div className="text-gray-800 text-lg mb-4 line-clamp-3 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: content.length > 150 
                    ? content.substring(0, 150) + '...' 
                    : content 
                }} />
              </div>
            )}
            
            <div className="mt-auto hover:text-gray-600">
              <span className="inline-block bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                Read More
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default PostCard;