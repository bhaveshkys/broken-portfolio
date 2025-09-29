import React from 'react';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600">
            Let's work together on your next project
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Let's Connect
            </h3>
            <p className="text-lg mb-8 leading-relaxed text-gray-600">
              I'm always interested in hearing about new projects and opportunities.
              Whether you're looking for a developer, have a question, or just want to connect.
            </p>

            <div className="space-y-4">
              {[{
                icon: Mail,
                label: 'bhaveshsharma8@gmail.com',
                href: 'mailto:bhaveshsharma8@gmail.com'
              },
              {
                icon: Linkedin,
                label: 'LinkedIn Profile',
                href: 'https://www.linkedin.com/in/bhavesh-sharma-57755a214/'
              },
              {
                icon: Github,
                label: 'GitHub Profile',
                href: 'https://github.com/bhaveshkys'
              },
              {
                icon: Twitter,
                label: '@bhaveshsharma',
                href: 'https://twitter.com/bhaveshsharma'
              }
              ].map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  target={contact.href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel={contact.href.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                  className="flex items-center space-x-3 hover:text-blue-600 text-gray-600"
                >
                  <contact.icon size={20} />
                  <span>{contact.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
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
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject (Optional)"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;