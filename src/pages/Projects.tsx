import React, { useState } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: 'URL Shortener',
      description: 'A high-performance URL shortening service with analytics dashboard',
      technologies: 'Next.js, TypeScript, Redis, PostgreSQL',
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 2,
      title: 'FlowerGarden',
      description: 'Mobile app for plant enthusiasts with plant identification',
      technologies: 'React Native & Firebase, Node.js',
      imageUrl: 'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 3,
      title: 'EventHub',
      description: 'Distributed event processing system for real-time analytics',
      technologies: 'Kafka, Spring Boot, Elasticsearch',
      imageUrl: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 4,
      title: 'PaymentGateway',
      description: 'Secure payment processing API with fraud detection',
      technologies: 'Node.js, Express, MongoDB',
      imageUrl: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 5,
      title: 'CloudMonitor',
      description: 'Cloud resource monitoring tool with alerting capabilities',
      technologies: 'Python, FastAPI, TimescaleDB, React',
      imageUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 6,
      title: 'DataSync',
      description: 'ETL pipeline for syncing data between heterogeneous systems',
      technologies: 'Java, Spring Batch, PostgreSQL',
      imageUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Projects</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            A showcase of backend systems and full-stack apps I've built over the years
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.1}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-all duration-300 hover:translate-y-[-4px] h-full flex flex-col">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                ></div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">{project.technologies}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">{project.description}</p>
                  <Button href="#" variant="outline" size="sm" className="self-start hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    View Details →
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;