import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

interface TimelineItemProps {
  company: string;
  role: string;
  period: string;
  achievements: string[];
  isLeft: boolean;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  company,
  role,
  period,
  achievements,
  isLeft,
  index,
}) => {
  return (
    <AnimatedSection 
      delay={index * 0.1}
      className={`relative flex items-center justify-center mb-8 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-500 border-4 border-white dark:border-gray-800 z-10 hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors" />
      
      {/* Content card */}
      <div 
        className={`relative bg-white dark:bg-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-shadow rounded-lg p-6 md:w-5/12 ml-10 md:ml-0 ${
          isLeft ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'
        }`}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company}</h3>
        <h4 className="text-lg font-medium text-primary-600 dark:text-primary-400 mb-1">{role}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{period}</p>
        <ul className="space-y-2">
          {achievements.map((achievement, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 mr-2"></span>
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};

const Experience: React.FC = () => {
  const experiences = [
    {
      company: 'TechScale Solutions',
      role: 'Senior Backend Engineer',
      period: 'Mar 2021 – Present',
      achievements: [
        'Designed search sync system handling 10k events/sec',
        'Improved API response time by 75% through caching strategy',
        'Led migration from monolithic architecture to microservices',
      ],
    },
    {
      company: 'DataFlow Systems',
      role: 'Backend Developer',
      period: 'Jun 2019 – Feb 2021',
      achievements: [
        'Refactored Python script into Kotlin/Spring Boot service with RabbitMQ',
        'Implemented real-time analytics pipeline processing 5TB daily',
        'Reduced cloud infrastructure costs by 40% through optimization',
      ],
    },
    {
      company: 'Fintech Innovate',
      role: 'Junior Software Engineer',
      period: 'Aug 2017 – May 2019',
      achievements: [
        'Developed RESTful APIs using Node.js and Express',
        'Implemented secure payment processing integration with Stripe',
        'Created automated testing suite improving code coverage by 45%',
      ],
    },
    {
      company: 'University Tech Lab',
      role: 'Research Assistant',
      period: 'Jan 2016 – Jul 2017',
      achievements: [
        'Contributed to open-source database performance benchmarking tool',
        'Assisted in research on distributed database optimization',
        'Published paper on efficient query execution in NoSQL databases',
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">My Experience</h1>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-3 md:left-1/2 transform md:-translate-x-1/2 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
          
          {/* Timeline items */}
          <div className="relative z-10">
            {experiences.map((exp, index) => (
              <TimelineItem
                key={index}
                company={exp.company}
                role={exp.role}
                period={exp.period}
                achievements={exp.achievements}
                isLeft={index % 2 === 0}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;