import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { Rss } from 'lucide-react';

interface RSSItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

const RSS: React.FC = () => {
  const rssItems: RSSItem[] = [
    {
      id: 1,
      title: 'New Backend Framework Emerges: Is It Worth the Hype?',
      date: 'June 15, 2024',
      excerpt: 'An analysis of the latest backend framework gaining traction in the industry...',
      url: '#',
    },
    {
      id: 2,
      title: 'The Future of Database Systems: Trends to Watch',
      date: 'June 10, 2024',
      excerpt: 'Exploring emerging database technologies and how they will shape backend development...',
      url: '#',
    },
    {
      id: 3,
      title: 'Optimizing API Performance: A Case Study',
      date: 'June 5, 2024',
      excerpt: 'How we improved API response times by 80% with these optimization techniques...',
      url: '#',
    },
    {
      id: 4,
      title: 'Securing Microservices: Best Practices for 2024',
      date: 'May 28, 2024',
      excerpt: 'Key security considerations when designing and implementing microservice architectures...',
      url: '#',
    },
    {
      id: 5,
      title: 'From Monolith to Microservices: A Journey',
      date: 'May 20, 2024',
      excerpt: 'Lessons learned from migrating a large-scale application from monolith to microservices...',
      url: '#',
    },
    {
      id: 6,
      title: 'Containerization for Backend Developers: A Guide',
      date: 'May 15, 2024',
      excerpt: 'How to effectively containerize your backend services for better deployment and scaling...',
      url: '#',
    },
    {
      id: 7,
      title: 'Event-Driven Architecture: Patterns and Pitfalls',
      date: 'May 8, 2024',
      excerpt: 'An in-depth look at implementing event-driven architecture in modern backend systems...',
      url: '#',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <AnimatedSection>
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">RSS Feed</h1>
            <Rss className="ml-3 h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            Stay updated with my latest articles and insights
          </p>
        </AnimatedSection>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {rssItems.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-all duration-300">
                  <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">{item.date}</div>
                  <a 
                    href={item.url}
                    className="block"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {item.title}
                    </h2>
                  </a>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.excerpt}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={0.8} className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border-l-4 border-primary-500 dark:border-primary-400">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Subscribe to my feed</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Stay updated with my latest articles and insights by subscribing to my RSS feed using your favorite RSS reader.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded flex items-center justify-between">
              <code className="text-gray-800 dark:text-gray-200">https://burak.dev/rss.xml</code>
              <button className="bg-primary-600 dark:bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 dark:hover:bg-primary-700 transition-colors text-sm">
                Copy URL
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Popular RSS readers: Feedly, Inoreader, NewsBlur, or the RSS feature in your browser.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default RSS;