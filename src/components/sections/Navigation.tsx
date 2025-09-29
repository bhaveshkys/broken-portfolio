import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 shadow-md bg-white">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        
        {/* Left side: name + dog */}
        <div className="flex items-center space-x-4">
          <a
            href="#hero"
            className="text-2xl font-bold text-blue-600"
          >
            Bhavesh Sharma
          </a>
          <div className="dog"></div>
        </div>

        {/* Right side: nav items */}
        <div className="space-x-6">
          {[
            { label: 'Home', href: '#hero' },
            { label: 'About', href: '#about' },
            { label: 'Blog', href: '#blog' },
            { label: 'Projects', href: '#projects' },
            { label: 'Contact', href: '#contact' }
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
