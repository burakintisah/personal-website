import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import { Code, Database, Server, Cpu, Globe, BookOpen, Download } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'Node.js', icon: <Server className="w-6 h-6" /> },
    { name: 'Java', icon: <Code className="w-6 h-6" /> },
    { name: 'Spring Boot', icon: <Code className="w-6 h-6" /> },
    { name: 'PostgreSQL', icon: <Database className="w-6 h-6" /> },
    { name: 'Redis', icon: <Database className="w-6 h-6" /> },
    { name: 'Elasticsearch', icon: <Globe className="w-6 h-6" /> },
    { name: 'Docker', icon: <Cpu className="w-6 h-6" /> },
    { name: 'Kubernetes', icon: <Cpu className="w-6 h-6" /> },
    { name: 'AWS', icon: <Server className="w-6 h-6" /> },
    { name: 'TypeScript', icon: <Code className="w-6 h-6" /> },
    { name: 'Python', icon: <Code className="w-6 h-6" /> },
    { name: 'CI/CD', icon: <BookOpen className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">About Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <AnimatedSection>
            <div className="flex justify-center md:justify-end">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                <img 
                  src="/profile.png" 
                  alt="Osman Burak İntişah" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Early Career</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I started my journey in software development during university, where I discovered my passion for backend systems. After graduating with a Computer Science degree, I joined a fintech startup where I built scalable payment processing systems serving thousands of customers daily.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Key Skills</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  My expertise lies in designing and implementing high-performance backend systems with a focus on scalability and reliability. I specialize in distributed systems, database optimization, and cloud infrastructure, with a commitment to writing clean, maintainable code.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Technical Interests</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I'm passionate about microservice architecture, event-driven systems, and performance optimization. Currently exploring the intersection of machine learning and backend systems, particularly in anomaly detection for system monitoring.
                </p>
              </div>

              {/* Resume Download Button */}
              <div className="pt-4">
                <Button 
                  href="/burak_intisah_resume.pdf" 
                  variant="primary" 
                  size="lg"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resume
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection delay={0.4}>
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-8">Technical Toolkit</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {skill.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.6} className="mt-16 text-center max-w-xl mx-auto py-8 border-t border-b border-gray-100 dark:border-gray-700">
          <p className="text-lg italic text-gray-600 dark:text-gray-400">
            "The best code is no code at all. Every new line of code you willingly bring into the world is code that has to be debugged, code that has to be read and understood, and code that has to be supported."
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-500">— My coding philosophy</p>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default About;