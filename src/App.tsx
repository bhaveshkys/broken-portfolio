import React, { useState, useEffect } from 'react';
import { User, Code, Mail, ExternalLink, Github, Linkedin, Twitter, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import ParticleEffect from './components/ParticleEffect';
import { Boxes } from './components/background-boxes';
import { developerImageBase64 } from './data/imageData';
import { 
  StrapiPost, 
  StrapiResponse, 
  StrapiCoverImage,
  BlogPost, 
  SectionState, 
  CSSChallenge,
  CyclingTextProps 
} from './types';

// Import project images properly for Vite
import profiledImg from './assets/projectImages/profiled.png';
import lexievoImg from './assets/projectImages/lexievo.png';
import brooochImg from './assets/projectImages/brooochAndCo.png';
import edvantaImg from './assets/projectImages/edvanta.png';

const cssProblems: CSSChallenge[] = [
  {
    section: 'hero',
    title: 'Fix Hero Section',
    description: 'The hero section is rotated and bouncing! Fix the transform and animation properties.',
    brokenCSS: `transform: rotate(0deg) scale(1);
animation: none;`,
    correctCSS: `transform: rotate(0deg) scale(1);
animation: none;`,
    hint: 'Set rotation to 0deg, scale to 1, and remove animation'
  },
  {
    section: 'about',
    title: 'Fix About Section',
    description: 'The about section is spinning! Fix the rotation and animation.',
    brokenCSS: `transform: rotate(0deg);
animation: none;`,
    correctCSS: `transform: rotate(0deg);
animation: none;`,
    hint: 'Remove rotation and stop the spinning animation'
  },
  {
    section: 'projects',
    title: 'Fix Projects Section',
    description: 'Project cards are scattered everywhere! Fix their positioning.',
    brokenCSS: `transform: translateX(0px) rotate(0deg);
position: static;`,
    correctCSS: `transform: translateX(0px) rotate(0deg);
position: static;`,
    hint: 'Reset transform and use static positioning'
  },
  {
    section: 'contact',
    title: 'Fix Contact Section',
    description: 'Contact form is upside down! Fix the flip.',
    brokenCSS: `transform: rotateX(0deg) rotateY(0deg);
filter: none;`,
    correctCSS: `transform: rotateX(0deg) rotateY(0deg);
filter: none;`,
    hint: 'Remove all rotations and filters'
  }
];

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
  const [isChaos, setIsChaos] = useState(false);
  const [characterVisible, setCharacterVisible] = useState(false);
  const [fixedSections, setFixedSections] = useState<SectionState>({
    hero: false,
    about: false,
    projects: false,
    contact: false
  });
  const [characterMessage, setCharacterMessage] = useState('');
  const [showingInfo, setShowingInfo] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState<CSSChallenge | null>(null);
  const [userCSS, setUserCSS] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [isAnimatingText, setIsAnimatingText] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

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
    window.open(`https://blog.bhaveshsharma.com/${slug}`, '_blank');
  };

  // Add the robot animation state here
  

  // Add useEffect for robot animation after other useEffects
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 3); // Cycle through 3 frames
    }, 300); // Change frame every 300ms

    return () => clearInterval(frameInterval);
  }, []);

  // Pokemon-style text animation
  const animateText = (text: string, callback?: () => void) => {
    setAnimatedText('');
    setIsAnimatingText(true);
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setAnimatedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsAnimatingText(false);
        if (callback) {
          setTimeout(callback, 1000);
        }
      }
    }, 50); // 50ms per character for Pokemon-style speed
  };

  const triggerChaos = () => {
    setIsChaos(true);
    setTimeout(() => {
      setShowCharacterModal(true);
      animateText("Oh no! You pressed the button! 😱 The website owner is sleeping and now everything is broken! You need to fix each section by editing the CSS code. Let me help you - click on any broken section to start coding!");
    }, 1000);
  };

  const closeCharacterModal = () => {
    setShowCharacterModal(false);
    setAnimatedText('');
    setCharacterVisible(false);
  };

  const openCSSEditor = (section: keyof SectionState) => {
    if (fixedSections[section]) return;
    
    const challenge = cssProblems.find(p => p.section === section);
    if (challenge) {
      setCurrentChallenge(challenge);
      setUserCSS(challenge.brokenCSS);
      setShowEditor(true);
      setAttempts(0);
    }
  };

  const checkCSS = () => {
    if (!currentChallenge) return;
    
    const normalizeCSS = (css: string) => {
      return css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim().toLowerCase();
    };
    
    const userNormalized = normalizeCSS(userCSS);
    const correctNormalized = normalizeCSS(currentChallenge.correctCSS);
    
    if (userNormalized === correctNormalized) {
      // Success!
      setFixedSections(prev => ({ ...prev, [currentChallenge.section]: true }));
      setShowEditor(false);
      setCurrentChallenge(null);
      
      const messages = {
        hero: "Perfect! 🎉 You fixed the hero section! This is John's portfolio homepage. He's a full-stack developer with 5 years of experience building amazing web applications.",
        about: "Excellent work! 👨‍💻 The about section is restored! John graduated from MIT with a Computer Science degree and loves creating user-friendly applications. He's passionate about React, Node.js, and modern web technologies.",
        projects: "Great job! 🚀 Projects section is back to normal! These are John's featured projects including an AI-powered chat app, an e-commerce platform, and a real-time collaboration tool. Each project showcases different technical skills.",
        contact: "Amazing! 📧 Contact section fixed! You can reach John through email, LinkedIn, or GitHub. He's always open to discussing new opportunities and interesting projects."
      };
      
      // Show character modal with section info
      setShowCharacterModal(true);
      animateText(messages[currentChallenge.section], () => {
        // Auto-close after animation completes
        setTimeout(() => {
          setShowCharacterModal(false);
          setAnimatedText('');
          
          if (Object.values({ ...fixedSections, [currentChallenge.section]: true }).every(Boolean)) {
            // All sections fixed - show final message
            setTimeout(() => {
              setShowCharacterModal(true);
              animateText("Incredible! 🌟 You've fixed everything by writing CSS code! John would be so proud of your coding skills. The website is back to normal. You're a true CSS hero!");
            }, 500);
          }
        }, 2000);
      });
    } else {
      setAttempts(prev => prev + 1);
      if (attempts < 2) {
        setCharacterMessage(`Not quite right! 🤔 Try again. Remember: ${currentChallenge.hint}`);
      } else {
        setCharacterMessage(`Having trouble? Here's the solution! Copy this code: ${currentChallenge.correctCSS}`);
      }
    }
  };

  const resetCSS = () => {
    if (currentChallenge) {
      setUserCSS(currentChallenge.brokenCSS);
      setAttempts(0);
    }
  };

  const allFixed = Object.values(fixedSections).every(Boolean);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isChaos && !allFixed ? '' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        isChaos && !fixedSections.hero ? 'transform rotate-12 translate-x-8' : ''
      } ${isChaos && !allFixed ? '' : 'bg-white/90'} backdrop-blur-sm border-b`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold transition-all duration-500 ${
              isChaos && !fixedSections.hero ? 'animate-pulse' : 'text-gray-800'
            }`}>
              Work Portfolio
            </h1>
            <div className="flex space-x-6">
              <a href="#about" className={`transition-colors hover:text-blue-600 ${
                isChaos && !fixedSections.hero ? '' : 'text-gray-600'
              }`}>About</a>
              <a href="#projects" className={`transition-colors hover:text-blue-600 ${
                isChaos && !fixedSections.hero ? '' : 'text-gray-600'
              }`}>Projects</a>
              <a href="#contact" className={`transition-colors hover:text-blue-600 ${
                isChaos && !fixedSections.hero ? '' : 'text-gray-600'
              }`}>Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Completely Isolated Fix Buttons Container - Outside all chaos effects */}
      {isChaos && (
        <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ transform: 'none !important', filter: 'none !important' }}>
          <div className="absolute top-4 right-4 space-y-3 pointer-events-auto">
            {!fixedSections.hero && (
              <div 
                className="bg-red-500 border-2 border-red-600 rounded-lg p-3 shadow-2xl cursor-pointer hover:bg-red-600 transition-colors"
                onClick={() => openCSSEditor('hero')}
                style={{ transform: 'none', animation: 'none', filter: 'none' }}
              >
                <Code className="mx-auto mb-1 text-white" size={24} />
                <p className="text-white font-bold text-xs text-center">HERO BROKEN</p>
                <p className="text-white text-xs text-center">Click to fix!</p>
              </div>
            )}
            
            {!fixedSections.about && (
              <div 
                className="bg-orange-500 border-2 border-orange-600 rounded-lg p-3 shadow-2xl cursor-pointer hover:bg-orange-600 transition-colors"
                onClick={() => openCSSEditor('about')}
                style={{ transform: 'none', animation: 'none', filter: 'none' }}
              >
                <p className="text-white font-bold text-xs text-center">ABOUT BROKEN</p>
                <p className="text-white text-xs text-center">Click to fix!</p>
              </div>
            )}
            
            {!fixedSections.projects && (
              <div 
                className="bg-blue-500 border-2 border-blue-600 rounded-lg p-3 shadow-2xl cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => openCSSEditor('projects')}
                style={{ transform: 'none', animation: 'none', filter: 'none' }}
              >
                <p className="text-white font-bold text-xs text-center">PROJECTS BROKEN</p>
                <p className="text-white text-xs text-center">Click to fix!</p>
              </div>
            )}
            
            {!fixedSections.contact && (
              <div 
                className="bg-purple-500 border-2 border-purple-600 rounded-lg p-3 shadow-2xl cursor-pointer hover:bg-purple-600 transition-colors"
                onClick={() => openCSSEditor('contact')}
                style={{ transform: 'none', animation: 'none', filter: 'none' }}
              >
                <p className="text-white font-bold text-xs text-center">CONTACT BROKEN</p>
                <p className="text-white text-xs text-center">Click to fix!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section 
        id="hero" 
        className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 relative bg-white overflow-hidden ${isChaos && !fixedSections.hero ? 'transform rotate-12 scale-110 animate-pulse' : ''}`}
        onClick={() => isChaos && openCSSEditor('hero')}
      >
        {/* Background Boxes */}
        <Boxes />
        
        {/* Overlay for better text readability - make it non-interactive */}
        <div className="absolute inset-0 z-10 pointer-events-none"></div>
        
        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto px-6 pt-32 w-full relative z-20 pointer-events-none flex-1 flex justify-center">
          {/* Name Section */}
          <div className='w-1/2 pointer-events-none' >
          {/* image here with name  */}
          </div>
          <div className='w-1/2 pointer-events-none' >
            <div className="text-center mb-2">
            <h1 className={`text-3xl lg:text-8xl font-bold text-black transition-all duration-500 ${isChaos && !fixedSections.hero ? 'animate-spin' : ''}`}>
              Bhavesh Sharma
            </h1>
          </div>
          
          {/* About Me Section with cycling text */}
          <div className="text-center lg:text-left max-w-4xl mx-auto pointer-events-auto">
            <div className=" rounded-lg p-8">
              
              <div className="space-y-4 text-lg font-semibold text-black leading-relaxed">
                <p>
                  {' '}
                  <CyclingText 
                    words={['full-stack developer', 'hardware tinkerer', 'UI/UX enthusiast', 'problem solver']}
                    className="text-blue-600 font-semibold"
                  />
                  {' '}who loves crafting digital experiences 
                  with modern technologies and creative solutions. My journey spans across 
                  web development, hardware tinkering, and UI/UX design.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring the latest tech trends, 
                  building innovative projects, or diving deep into the intersection of 
                  hardware and software development.
                </p>
              </div>
              
              {!isChaos ? (
                <div className="mt-8">
                 {/*  <button
                    onClick={triggerChaos}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl transform hover:scale-105 transition-all duration-200 shadow-lg animate-pulse"
                  >
                    🚨 DON'T PRESS THIS BUTTON 🚨
                  </button> */}
                </div>
              ) : fixedSections.hero ? (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start mt-8">
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                    View My Work
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                    Download CV
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          </div>
          
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className={`py-20 transition-all duration-1000 ${
          isChaos && !fixedSections.about ? 'transform rotate-180 cursor-pointer' : 'bg-white'
        }`}
        onClick={() => isChaos && openCSSEditor('about')}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isChaos && !fixedSections.about ? 'transform rotate-45 scale-150 animate-spin' : ''
          }`}>
            <h2 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
              isChaos && !fixedSections.about ? '' : 'text-gray-800'
            }`}>
              Latest Blog Posts
            </h2>
            <p className="text-gray-600 text-lg">Thoughts, tutorials, and insights from my development journey</p>
          </div>
          
          <div className={`grid md:grid-cols-2 lg:grid-cols-2 gap-8 transition-all duration-1000 ${
            isChaos && !fixedSections.about ? 'transform -rotate-12' : ''
          }`}>
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
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : blogPosts.length > 0 ? (
              blogPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    isChaos && !fixedSections.about ? 
                      index === 0 ? 'transform translate-y-32 rotate-90 animate-spin' :
                      index === 1 ? 'transform -translate-x-32 rotate-12' :
                      index === 2 ? 'animate-bounce' : 'animate-pulse'
                    : ''
                  }`}
                  onClick={() => handleBlogClick(post.slug)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.coverImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CbG9nIFBvc3Q8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4='} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to a placeholder if image doesn't exist
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CbG9nIFBvc3Q8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db21pbmcgU29vbjwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {post.category && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${post.categoryColor}`}>
                          {post.category}
                        </span>
                      )}
                      <span className="text-gray-500 text-sm ml-auto">{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                    <span className="text-blue-600 hover:text-blue-800 font-semibold">Read More →</span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no posts are available
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  No blog posts available at the moment.
                </div>
                <p className="text-gray-400">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        className={`py-20 transition-all duration-1000 ${isChaos && !fixedSections.projects ? 'transform rotate-6 cursor-pointer' : 'bg-gray-50'}`}
        onClick={() => isChaos && openCSSEditor('projects')}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${isChaos && !fixedSections.projects ? 'transform -rotate-12 scale-75' : ''}`}>
            <h2 className={`text-4xl font-bold mb-4 transition-all duration-500 ${isChaos && !fixedSections.projects ? 'animate-bounce' : 'text-gray-800'}`}>
              Featured Projects
            </h2>
          </div>
          
          <div className="space-y-8">
            {[
              [
                {
                  title: 'ProfilED',
                  description: 'FullStack gamified AI-driven assessments & trainings to help you understand strengths, close skill gaps, and unlock your future potential.',
                  tech: ['Vue.js', 'MongoDB', 'Vapi.ai', 'LangChain', 'Node.js', 'Express'],
                  image: profiledImg,
                  hasLiveDemo: true,
                  liveUrl: 'https://profiled.app/',
                  hasGithub: false,
                  githubTooltip: 'No public code available - made for Edvanta'
                },
                {
                  title: 'LexiEvo',
                  description: 'FullStack Platform for lawyers looking to have a virtual AI receptionist that takes all calls and then classifies them like new case, old case or misc. Platform shows who called, what was the enquiry and can transfer calls to the lawyer if needed. Made website, dashboard and server.',
                  tech: ['Next.js', 'React.js', 'MongoDB', 'Vapi', 'Node.js', 'Express'],
                  image: lexievoImg,
                  hasLiveDemo: true,
                  liveUrl: 'https://www.lexievo.com/',
                  hasGithub: true,
                  githubUrl: 'https://github.com/bhaveshkys/LawyerVapiWeb'
                }
              ],
              [
                {
                  title: 'Brooch&Co',
                  description: 'E-commerce website built with Next.js and Shopify headless, fully mobile responsive with modern design and seamless shopping experience.',
                  tech: ['Next.js', 'Shopify Headless'],
                  image: brooochImg,
                  hasLiveDemo: true,
                  liveUrl: 'https://www.broochandco.in/',
                  hasGithub: false,
                  githubTooltip: 'No public code available - made for BroochAndCo'
                },
                {
                  title: 'Edvanta Company Website',
                  description: 'Built with a team of 4 people. Main company website with really fast blog loading thanks to custom logic - each time a new blog is added in Notion, blog is converted to MD and then website is rebuilt.',
                  tech: ['Nuxt.js', 'Node.js'],
                  image: edvantaImg,
                  hasLiveDemo: true,
                  liveUrl: 'https://edvanta.com/',
                  hasGithub: false,
                  githubTooltip: 'No public code available - made for Edvanta'
                }
              ],
             
            ].map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-8 h-64">
                {row.map((project, index) => (
                  <div
                    key={index}
                    className={`flex-1 transition-all duration-500 ease-in-out group ${
                      isChaos && !fixedSections.projects 
                        ? `transform ${index === 0 ? 'rotate-45 translate-y-20 translate-x-32' : '-rotate-30 -translate-x-10 translate-y-40'} animate-pulse` 
                        : ''
                    }`}
                    style={{
                      flex: `var(--flex-${rowIndex}-${index}, 1)`
                    }}
                    onMouseEnter={() => {
                      document.documentElement.style.setProperty(`--flex-${rowIndex}-${index}`, '2');
                      document.documentElement.style.setProperty(`--flex-${rowIndex}-${1-index}`, '0');
                    }}
                    onMouseLeave={() => {
                      document.documentElement.style.setProperty(`--flex-${rowIndex}-${index}`, '1');
                      document.documentElement.style.setProperty(`--flex-${rowIndex}-${1-index}`, '1');
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full transition-all duration-500 group-hover:shadow-2xl relative">
                      {/* Background Image - Hidden on Hover */}
                      <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to a placeholder if image doesn't exist
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9qZWN0IEltYWdlPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29taW5nIFNvb248L3RleHQ+PC9zdmc+';
                          }}
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        {/* Code icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Code size={48} className="text-white opacity-80" />
                        </div>
                      </div>
                      
                      {/* Compact Title - Visible when not hovered */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-500 group-hover:opacity-0">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.slice(0, 2).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs bg-white bg-opacity-20 text-white rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-white bg-opacity-20 text-white rounded-full">
                              +{project.tech.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Content - Visible on Hover */}
                      <div className="absolute inset-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center bg-white">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-3">
                          {project.hasLiveDemo && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                            >
                              <ExternalLink size={14} />
                              <span>Live Demo</span>
                            </a>
                          )}
                          {project.hasGithub ? (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors text-sm"
                            >
                              <Github size={14} />
                              <span>Code</span>
                            </a>
                          ) : (
                            <div className="relative group/tooltip">
                              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm">
                                <Github size={14} />
                                <span>Code</span>
                              </button>
                              {project.githubTooltip && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                                  {project.githubTooltip}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className={`py-20 transition-all duration-1000 ${
          isChaos && !fixedSections.contact ? 'transform rotateX(180deg) rotateY(180deg) cursor-pointer' : 'bg-white'
        }`}
        onClick={() => isChaos && openCSSEditor('contact')}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isChaos && !fixedSections.contact ? 'transform rotate-45 scale-125 hue-rotate-180' : ''
          }`}>
            <h2 className={`text-4xl font-bold mb-4 transition-all duration-500 ${
              isChaos && !fixedSections.contact ? 'animate-spin' : 'text-gray-800'
            }`}>
              Get In Touch
            </h2>
            <p className={`text-xl transition-all duration-500 ${
              isChaos && !fixedSections.contact ? 'animate-pulse' : 'text-gray-600'
            }`}>
              Let's work together on your next project
            </p>
          </div>
          
          <div className={`grid md:grid-cols-2 gap-12 transition-all duration-1000 ${
            isChaos && !fixedSections.contact ? 'transform rotate-12 hue-rotate-90' : ''
          }`}>
            <div className={`transition-all duration-1000 ${
              isChaos && !fixedSections.contact ? 'transform -translate-y-20 rotate-45' : ''
            }`}>
              <h3 className={`text-2xl font-bold mb-6 transition-all duration-500 ${
                isChaos && !fixedSections.contact ? '' : 'text-gray-800'
              }`}>
                Let's Connect
              </h3>
              <p className={`text-lg mb-8 leading-relaxed transition-all duration-500 ${
                isChaos && !fixedSections.contact ? 'animate-bounce' : 'text-gray-600'
              }`}>
                I'm always interested in hearing about new projects and opportunities. 
                Whether you're looking for a developer, have a question, or just want to connect.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'john.doe@email.com', href: 'mailto:john.doe@email.com' },
                  { icon: Linkedin, label: 'LinkedIn Profile', href: '#' },
                  { icon: Github, label: 'GitHub Profile', href: '#' },
                  { icon: Twitter, label: '@johndoe', href: '#' }
                ].map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className={`flex items-center space-x-3 transition-all duration-300 hover:text-blue-600 ${
                      isChaos && !fixedSections.contact 
                        ? 'animate-pulse' 
                        : 'text-gray-600'
                    }`}
                  >
                    <contact.icon size={20} />
                    <span>{contact.label}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${
              isChaos && !fixedSections.contact ? 'transform translate-x-20 -rotate-12' : ''
            }`}>
              <form 
                action="https://formsubmit.co/bhaveshsharma8@gmail.com" 
                method="POST"
                className="space-y-6"
              >
                {/* Hidden fields for FormSubmit configuration */}
                <input type="hidden" name="_subject" value="New Portfolio Contact Form Submission" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value={window.location.origin + "?success=true"} />
                
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ${
                      isChaos && !fixedSections.contact 
                        ? 'animate-pulse' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ${
                      isChaos && !fixedSections.contact 
                        ? 'animate-bounce' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject (Optional)"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ${
                      isChaos && !fixedSections.contact 
                        ? 'animate-bounce' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Your Message"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ${
                      isChaos && !fixedSections.contact 
                        ? 'animate-spin' 
                        : 'border-gray-300'
                    }`}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    isChaos && !fixedSections.contact 
                      ? 'animate-bounce' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Editor Modal */}
      {showEditor && currentChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{currentChallenge.title}</h3>
                  <p className="text-gray-600 mt-1">{currentChallenge.description}</p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit the CSS to fix this section:
                  </label>
                  <textarea
                    value={userCSS}
                    onChange={(e) => setUserCSS(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your CSS here..."
                  />
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={checkCSS}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Play size={16} />
                      <span>Apply CSS</span>
                    </button>
                    <button
                      onClick={resetCSS}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <RotateCcw size={16} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hint:
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm">{currentChallenge.hint}</p>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current broken CSS:
                  </label>
                  <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm font-mono text-red-800 overflow-auto">
{currentChallenge.brokenCSS}
                  </pre>
                  
                  {attempts >= 2 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solution:
                      </label>
                      <pre className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm font-mono text-green-800 overflow-auto">
{currentChallenge.correctCSS}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Guide */}
      {characterVisible && (
        <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
          characterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <div className="relative">
            {/* Animated Robot Character */}
            <div className="w-20 h-20 flex items-center justify-center animate-float">
              <img 
                src={`/robot frames/frame${currentFrame + 1}.png`}
                alt="CSS Helper Robot"
                className="w-16 h-16 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            {/* Speech Bubble */}
            {characterMessage && (
              <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-200">
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
                <p className="text-sm text-gray-800 leading-relaxed">{characterMessage}</p>
                {!allFixed && (
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <AlertTriangle size={12} className="mr-1" />
                    <span>Click on broken sections to edit CSS and fix them!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {allFixed && isChaos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">CSS Master!</h2>
            <p className="text-gray-600 mb-6">
              Incredible! You've successfully repaired John's portfolio website by writing and editing CSS code. 
              You're a true CSS hero! The website owner would be amazed by your coding skills.
            </p>
            <button
              onClick={() => {
                setIsChaos(false);
                setCharacterVisible(false);
                setFixedSections({ hero: false, about: false, projects: false, contact: false });
                setCharacterMessage('');
                setShowEditor(false);
                setCurrentChallenge(null);
                setShowCharacterModal(false);
                setAnimatedText('');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Pokemon-style Character Modal */}
      {showCharacterModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none" style={{ fontFamily: 'monospace' }}>
          <div className="max-w-2xl mx-4 pointer-events-auto">
            {/* Character Display - Just the floating robot */}
            <div className="text-center mb-4">
              <div className="w-32 h-32 mx-auto flex items-center justify-center animate-float-slow">
                <img 
                  src={`/robot frames/frame${currentFrame + 1}.png`}
                  alt="CSS Helper Robot"
                  className="w-24 h-24 object-contain drop-shadow-lg"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
            
            {/* Text Box - Floating speech bubble */}
            <div className="bg-white/95 backdrop-blur-sm border-4 border-gray-800 rounded-lg p-6 shadow-2xl">
              <div className="bg-gray-100 border-2 border-gray-400 rounded p-4 min-h-[120px] relative">
                <p className="text-lg leading-relaxed text-gray-800 pixel-font">
                  {animatedText}
                  {isAnimatingText && (
                    <span className="inline-block w-3 h-6 bg-gray-800 ml-1 animate-pulse"></span>
                  )}
                </p>
              </div>
              
              {/* Action Button */}
              <div className="text-center mt-4">
                {!isAnimatingText && (
                  <button
                    onClick={closeCharacterModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded border-2 border-blue-800 transition-colors pixel-font text-lg"
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



      