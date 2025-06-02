import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Download } from 'lucide-react';

const Home: React.FC = () => {
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
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-shadow group"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Project {i}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Backend, API, Database</p>
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
            <div className="max-w-3xl mx-auto space-y-8">
              {[1, 2].map((i) => (
                <div 
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700 pb-8 group"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Optimizing Database Performance in Distributed Systems
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">June {10 + i}, 2024</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Exploring techniques for improving query performance and reducing latency in large-scale databases...
                  </p>
                  <Button to="/blog" variant="outline" size="sm" className="group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
                    Read More →
                  </Button>
                </div>
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