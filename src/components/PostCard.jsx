import React, { useState, useEffect } from 'react';
import appwriteService from "../appwrite/conf";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostCard({ $id, title, featuredImage, content, userId, className = '', tags = [], date }) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  useEffect(() => {
    if (userData && userId === userData.$id) setIsAuthor(true);
  }, [userData, userId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        await appwriteService.deletePost($id);
        if (featuredImage) await appwriteService.deleteFile(featuredImage);
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('Failed to delete post. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden ${className}`}>
      
      {/* Image Section */}
      <div className="relative group h-64 overflow-hidden rounded-t-3xl">
        <img
          src={appwriteService.getFilePreview(featuredImage)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Author Action Buttons */}
        {isAuthor && (
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/edit-post/${$id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all"
              title="Edit Post"
            >✏️</Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md transition-all disabled:opacity-50"
              title="Delete Post"
            >🗑️</button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h2>

        {/* Excerpt */}
        {content && (
          <div className="text-gray-700 text-base mb-4 line-clamp-4 relative">
            <div
              dangerouslySetInnerHTML={{
                __html: content.length > 200 ? content.substring(0, 200) + '...' : content,
              }}
            />
          </div>
        )}

        {/* Meta & Read More */}
        <div className="mt-auto flex justify-between items-center">
          {date && <span className="text-gray-400 text-sm">{new Date(date).toLocaleDateString()}</span>}
          <Link
            to={`/post/${$id}`}
            className="text-indigo-600 font-semibold text-sm relative group"
          >
            Read More
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
