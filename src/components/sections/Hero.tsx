import { useState, useEffect } from 'react';
import { Boxes } from '../background-boxes';
import { CyclingTextProps } from '../../types';
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
const Hero: React.FC = () => {
  return (
   <section 
        id="hero" 
        className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 relative bg-white overflow-hidden `}
        
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
            <h1 className={`text-3xl lg:text-8xl font-bold text-black transition-all duration-500 `}>
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
              
             
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start mt-8">
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                    View My Work
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/Bhavesh-ATS-2-August25.pdf';
                      link.download = 'Bhavesh-Sharma-CV.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    Download CV
                  </button>
                </div>
             
            </div>
          </div>
          </div>
          
        </div>
      </section>
  );
};

export default Hero;