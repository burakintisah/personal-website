import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import { Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  category: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Optimizing Database Performance in Distributed Systems',
      date: 'June 12, 2024',
      excerpt: 'Exploring techniques for improving query performance and reducing latency in large-scale distributed database systems.',
      category: 'Database',
    },
    {
      id: 2,
      title: 'Building Resilient Microservices with Circuit Breakers',
      date: 'May 28, 2024',
      excerpt: 'How to implement circuit breakers in your microservice architecture to prevent cascading failures and improve system stability.',
      category: 'Microservices',
    },
    {
      id: 3,
      title: 'Event-Driven Architecture: Patterns and Pitfalls',
      date: 'April 15, 2024',
      excerpt: 'A deep dive into event-driven architecture patterns, their benefits, and common pitfalls to avoid when implementing them.',
      category: 'Architecture',
    },
    {
      id: 4,
      title: 'Containerization Best Practices for Backend Services',
      date: 'March 22, 2024',
      excerpt: 'Essential best practices for containerizing backend services with Docker and orchestrating them with Kubernetes.',
      category: 'DevOps',
    },
    {
      id: 5,
      title: 'From SQL to NoSQL: When and Why to Make the Switch',
      date: 'February 18, 2024',
      excerpt: 'Analyzing the tradeoffs between SQL and NoSQL databases and guidance on choosing the right database for your specific use case.',
      category: 'Database',
    },
  ];

  const categories = [
    'Backend', 'DevOps', 'Kotlin', 'Database', 'Microservices', 'Architecture', 'Performance', 'Security'
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            Thoughts on backend architecture, performance tuning, and developer best practices
          </p>
        </AnimatedSection>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={index * 0.1}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-all duration-300">
                    <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">{post.date}</div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {post.title}
                    </h2>
                    <div className="mb-3 inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                      {post.category}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                    <Button href="#" variant="outline" size="sm" className="hover:bg-primary-50 dark:hover:bg-primary-900/20">
                      Read More →
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <AnimatedSection delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <Tag className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" /> Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 cursor-pointer transition-colors"
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Subscribe</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Get notified when I publish new articles</p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 flex-grow"
                    />
                    <Button variant="primary" className="rounded-l-none">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;