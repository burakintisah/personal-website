import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { Github, Linkedin, Mail, Instagram, ExternalLink, BookOpen, Users } from 'lucide-react';

const Connect: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-primary-600 dark:text-primary-400 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Let's Connect</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              I'm always excited to connect with fellow developers, entrepreneurs, and curious minds. 
              Feel free to reach out through any of these platforms!
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <a
              href="https://github.com/burakintisah"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Github className="h-8 w-8 text-gray-800 dark:text-white mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Check out my open source projects and contributions
              </p>
            </a>

            <a
              href="https://linkedin.com/in/burakintisah"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Linkedin className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LinkedIn</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with me professionally and see my career journey
              </p>
            </a>

            <a
              href="https://www.instagram.com/osman.burakk"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Instagram className="h-8 w-8 text-pink-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Instagram</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Follow my personal journey and behind-the-scenes moments
              </p>
            </a>

            <a
              href="https://x.com/osman_burakk"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-black dark:text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Twitter</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Follow my thoughts and updates on technology and life
              </p>
            </a>

            <a
              href="https://medium.com/@burak.intisah"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medium</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Read my articles on software development, technology and more
              </p>
            </a>

            <a
              href="mailto:burak.intisah@gmail.com"
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Reach out for collaborations, opportunities, or just to say hi
              </p>
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="mt-16 text-center">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8 border border-primary-200 dark:border-primary-800 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary-800 dark:text-primary-200 mb-4">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-primary-700 dark:text-primary-300 text-lg">
              Whether you're looking to collaborate on a project, discuss technology trends, 
              or just want to connect with a fellow developer, I'd love to hear from you. 
              Don't hesitate to reach out through any of the platforms above!
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Connect; 