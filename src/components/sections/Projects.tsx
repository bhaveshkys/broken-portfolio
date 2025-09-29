import {  Code, ExternalLink, Github, } from 'lucide-react';

import profiledImg from '../../assets/projectImages/profiled.png';
import lexievoImg from '../../assets/projectImages/lexievo.png';
import brooochImg from '../../assets/projectImages/brooochAndCo.png';
import edvantaImg from '../../assets/projectImages/edvanta.png';

const Projects= () => {
 

  return (
<section 
        id="projects" 
        className={`py-20 transition-all duration-1000 `}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 `}>
            <h2 className={`text-4xl font-bold mb-4 transition-all duration-500 `}>
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
                    className={`flex-1 transition-all duration-500 ease-in-out group`}
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
  );
};

export default Projects;