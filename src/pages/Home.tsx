import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Download, ExternalLink } from 'lucide-react';

const Home: React.FC = () => {
  // Featured projects data
  const featuredProjects = [
    {
      id: 1,
      title: 'URL Shortener',
      description: 'A secure, serverless URL-shortening backend on AWS using Lambda, API Gateway, DynamoDB, Cognito, and CloudWatch.',
      tags: ['AWS'],
      imageUrl: '/projects/photos/url-shortener.png',
    },
    {
      id: 2,
      title: 'FlowerGarden',
      description: 'A full-stack online flower shop with a React frontend and SQL-based backend supporting browsing, cart, and checkout.',
      tags: ['React', 'SQL', 'Node.js'],
      imageUrl: '/projects/photos/flowergarden.png',
    },
    {
      id: 3,
      title: 'Confix',
      description: 'A fullstack monorepo application for managing configuration parameters with country-based overrides.',
      tags: ['Vue', 'Node.js'],
      imageUrl: '/projects/photos/confix.png',
    },
  ];

  // Featured blog posts data
  const featuredBlogPosts = [
    {
      id: 1,
      title: 'TDD and BDD: Different Focuses, Same Goal — High-Quality Software',
      url: 'https://medium.com/@burak.intisah/tdd-and-bdd-different-focuses-same-goal-high-quality-software-7ef529f9d3dc',
      summary: 'Choosing between test-driven development and behavior-driven development—with histories, pros/cons, key differences, and best practices—helps teams deliver higher-quality software.',
      tag: 'Software Development',
    },
    {
      id: 2,
      title: 'What Is Optimistic Nihilism?',
      url: 'https://medium.com/@burak.intisah/what-is-optimistic-nihilism-600c4abaa999',
      summary: 'An introduction to optimistic nihilism, explaining how embracing life\'s impermanence can reduce stress, foster freedom, and still allow us to find joy and purpose.',
      tag: 'Philosophy',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 dark:hidden"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1600")',
            opacity: 0.1
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center z-0 hidden dark:block"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600")',
            opacity: 0.15
          }}
        />
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Osman Burak İntişah
              <br />
              <span className="text-primary-600 dark:text-primary-400">Software Engineer</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Crafting scalable APIs, databases, and backend systems
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button to="/projects" variant="primary" size="lg">
                View Projects
              </Button>
              <Button to="/about" variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-gray-400 dark:border-gray-500 flex justify-center pt-2">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Preview Sections */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-400 dark:text-gray-500 text-4xl">📁</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">{project.description}</p>
                    <Button to="/projects" variant="outline" size="sm" className="group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
                      View Details →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button to="/projects" variant="secondary">See All Projects</Button>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Latest Blog Posts</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {featuredBlogPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center gap-2">
                      {post.title}
                      <ExternalLink className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                        {post.tag}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button to="/blog" variant="secondary">Read All Posts</Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;