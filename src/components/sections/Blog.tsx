import React from 'react';
import { BlogPost } from '../../types';

interface BlogProps {
  isLoadingBlogs: boolean;
  blogPosts: BlogPost[];
  formatDate: (dateString: string) => string;
  handleBlogClick: (slug: string) => void;
}

const Blog: React.FC<BlogProps> = ({
  isLoadingBlogs,
  blogPosts,
  formatDate,
  handleBlogClick,
}) => {
  return (
    <section
      id="blog"
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Latest Blog Posts
          </h2>
          <p className="text-gray-600 text-lg">Thoughts, tutorials, and insights from my development journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {isLoadingBlogs ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-20 ml-auto"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleBlogClick(post.slug)}
              >
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-auto">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {post.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No blog posts available. Please check the Strapi API connection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;