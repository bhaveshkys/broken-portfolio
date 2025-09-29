import React, { useState, useEffect } from 'react';

import { Boxes } from './components/background-boxes';
import Navigation from './components/sections/Navigation';
import Hero from './components/sections/Hero';
import Blog from './components/sections/Blog';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import { 
  StrapiPost, 
  StrapiResponse, 
  StrapiCoverImage,
  BlogPost,
  CyclingTextProps 
} from './types';

// Import project images properly for Vite




// Enhanced CyclingText component
const CyclingText: React.FC<CyclingTextProps> = ({ words, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping && !isDeleting) {
      // Typing effect
      if (displayedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, 100); // Typing speed
      } else {
        // Finished typing, minimal pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
          setIsTyping(false);
        }, 300); // Reduced from 2000ms to 300ms for constant cycling
      }
    } else if (isDeleting) {
      // Deleting effect
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        }, 50); // Deleting speed
      } else {
        // Finished deleting, move to next word immediately
        timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
          setIsDeleting(false);
          setIsTyping(true);
        }, 100); // Minimal pause before next word
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, displayedText, isTyping, isDeleting, words]);

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
function App() {


  // Add blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  // Strapi API functions with better error handling and CORS handling
  const fetchAPI = async (path: string, options: RequestInit = {}) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors' as RequestMode,
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`https://upbeat-fish-9e996a6b3b.strapiapp.com/api${path}`, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      // Return empty response to prevent app crash
      return { data: [], meta: { pagination: { start: 0, limit: 0, total: 0 } } };
    }
  };

  const transformStrapiPost = (strapiPost: StrapiPost): BlogPost => {
    // Get category color based on title/description content since no category field exists
    const getCategoryColor = (title: string, description: string): string => {
      const content = `${title} ${description}`.toLowerCase();
      
      const categories = [
        { keywords: ['react', 'jsx', 'component'], color: 'bg-blue-100 text-blue-800', name: 'React' },
        { keywords: ['javascript', 'js', 'node'], color: 'bg-yellow-100 text-yellow-800', name: 'JavaScript' },
        { keywords: ['typescript', 'ts'], color: 'bg-blue-100 text-blue-800', name: 'TypeScript' },
        { keywords: ['mysql', 'database', 'sql', 'bug'], color: 'bg-red-100 text-red-800', name: 'Database' },
        { keywords: ['hardware', 'iot', 'arduino'], color: 'bg-green-100 text-green-800', name: 'Hardware' },
        { keywords: ['design', 'ui', 'ux'], color: 'bg-purple-100 text-purple-800', name: 'Design' },
        { keywords: ['devops', 'docker', 'kubernetes'], color: 'bg-orange-100 text-orange-800', name: 'DevOps' },
        { keywords: ['tutorial', 'guide', 'how'], color: 'bg-indigo-100 text-indigo-800', name: 'Tutorial' },
        { keywords: ['meme', 'internet', 'viral'], color: 'bg-pink-100 text-pink-800', name: 'Tech Culture' },
      ];
      
      for (const category of categories) {
        if (category.keywords.some(keyword => content.includes(keyword))) {
          return category.color;
        }
      }
      
      return 'bg-gray-100 text-gray-800';
    };

    // Get category name based on content
    const getCategoryName = (title: string, description: string): string => {
      const content = `${title} ${description}`.toLowerCase();
      
      if (content.includes('mysql') || content.includes('database') || content.includes('bug')) return 'Database';
      if (content.includes('react')) return 'React';
      if (content.includes('javascript') || content.includes('node')) return 'JavaScript';
      if (content.includes('meme') || content.includes('internet')) return 'Tech Culture';
      if (content.includes('tutorial') || content.includes('guide')) return 'Tutorial';
      if (content.includes('hardware') || content.includes('iot')) return 'Hardware';
      if (content.includes('design') || content.includes('ui')) return 'Design';
      if (content.includes('devops') || content.includes('docker')) return 'DevOps';
      
      return 'General';
    };

    // Get the best image URL (prefer medium, fallback to large, then original)
    const getImageUrl = (cover?: StrapiCoverImage): string | undefined => {
      if (!cover) return undefined;
      
      // Try medium first (good balance of quality and size)
      if (cover.formats.medium?.url) {
        return cover.formats.medium.url;
      }
      
      // Fallback to large
      if (cover.formats.large?.url) {
        return cover.formats.large.url;
      }
      
      // Fallback to original
      if (cover.url) {
        return cover.url;
      }
      
      return undefined;
    };

    const category = getCategoryName(strapiPost.title, strapiPost.description);

    return {
      id: strapiPost.id,
      title: strapiPost.title,
      description: strapiPost.description,
      slug: strapiPost.slug,
      publishedAt: strapiPost.publishedAt,
      coverImage: getImageUrl(strapiPost.cover),
      category,
      categoryColor: getCategoryColor(strapiPost.title, strapiPost.description),
    };
  };

  const getRecentPosts = async (limit: number = 4): Promise<BlogPost[]> => {
    try {
      const response: StrapiResponse<StrapiPost[]> = await fetchAPI(
        `/articles?populate=cover&sort=publishedAt:desc&pagination[limit]=${limit}`
      );
      
      console.log('Recent posts response:', response);
      return response.data.map(transformStrapiPost);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      // Return empty array when Strapi is not available
      return [];
    }
  };

  // Fetch blog posts on component mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoadingBlogs(true);
      try {
        const posts = await getRecentPosts(4);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
        setBlogPosts([]);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle blog card click - redirect to blog subdomain
  const handleBlogClick = (slug: string) => {
    window.open(`https://blogs.bhaveshsharma.com/blog/${slug}`, '_blank');
  };

      

  return (
 <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      <Blog blogPosts={blogPosts} isLoadingBlogs={isLoadingBlogs} formatDate={formatDate} handleBlogClick={handleBlogClick}  />
      <Projects  />
      <Contact />
    </div>
  );
}

export default App;



      