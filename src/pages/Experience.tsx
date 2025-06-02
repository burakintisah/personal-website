import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

interface TimelineItemProps {
  company: string;
  role: string;
  period: string;
  location: string;
  achievements: string[];
  techStack: string[];
  isLeft: boolean;
  index: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  company,
  role,
  period,
  location,
  achievements,
  techStack,
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{period} · {location}</p>
        
        {/* Achievements */}
        <ul className="space-y-2 mb-4">
          {achievements.map((achievement, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-2 mr-2 flex-shrink-0"></span>
              {achievement}
            </li>
          ))}
        </ul>

        {/* Tech Stack */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex flex-wrap gap-1">
            {techStack.map((tech, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

const Experience: React.FC = () => {
  const experiences = [
    {
      company: 'Cherry Technologies',
      role: 'Backend Engineer',
      period: 'Jul 2023 – Present',
      location: 'San Francisco & Istanbul',
      achievements: [
        'Built backend services for a U.S. healthcare BNPL platform using Spring Boot and Kotlin.',
        'Created notification workflows handling 150K SMS and 20K emails per day via Twilio and SendGrid.',
        'Refactored a legacy Python search-sync system into a high-throughput Maxwell→RabbitMQ→Elasticsearch pipeline, improving latency from 30s to 500ms (20K events/min).',
        'Upgraded n8n from v0.198 to v1.80 with zero downtime; migrated 7TB of historical data to a legacy read-only instance.',
        'Led architecture and stakeholder alignment for migrations; maintained system health via NewRelic, SonarQube, and GitLab CI/CD.',
      ],
      techStack: ['Spring Boot', 'Kotlin', 'Python', 'Maxwell', 'RabbitMQ', 'Elasticsearch', 'n8n', 'NewRelic', 'SonarQube', 'CI/CD'],
    },
    {
      company: 'Trendyol Group',
      role: 'Backend Engineer',
      period: 'Jun 2021 – Jul 2023',
      location: 'Istanbul, Turkey',
      achievements: [
        'Maintained high-traffic seller-platform services (3K RPM, 99.99% uptime, 0.001% error rate) using Spring Boot (Java/Kotlin) and Go.',
        'Reduced search latency by 30% by integrating Elasticsearch into the product-note system.',
        'Built microservices in an event-driven Kafka architecture; streamlined deployments with GitLab CI/CD, Docker, and Kubernetes.',
        'Increased test coverage from 50% to 90% using JUnit and Mockito; contributed React features in a micro-frontend.',
      ],
      techStack: ['Spring Boot', 'Kotlin', 'Java', 'Go', 'Elasticsearch', 'Kafka', 'CI/CD', 'JUnit', 'React'],
    },
    {
      company: 'IOTIQ',
      role: 'Software Engineering Intern',
      period: 'Jul 2020',
      location: 'Leipzig, Germany',
      achievements: [
        'Built a native Android app (Java) to optimize factory pallet-truck routing, reducing latency by 30%.',
        'Developed a lightweight MQTT broker in JavaScript and containerized it using Docker.',
      ],
      techStack: ['Java', 'Android', 'JavaScript', 'MQTT', 'Docker'],
    },
    {
      company: 'Facebook',
      role: 'Enterprise Engineer Intern',
      period: 'Jun 2020',
      location: 'Dublin, Ireland',
      achievements: [
        'Accepted an internship offer as Enterprise Engineer Intern but canceled due to COVID-19.',
        'Completed virtual onboarding modules and technical workshops after cancellation.',
      ],
      techStack: ['Data Structures', 'Algorithms'],
    },
    {
      company: 'TÜBİTAK BİLGEM',
      role: 'Software Engineer Intern',
      period: 'Jul 2019 – Sep 2019',
      location: 'Ankara, Turkey',
      achievements: [
        'Performed an internship at the Cyber Security Institute; administered Jira and Bitbucket systems.',
        'Extracted and analyzed data via Twitter and Instagram APIs.',
        'Assisted senior researchers in developing automated scripts for vulnerability scanning.',
      ],
      techStack: ['Jira', 'Bitbucket', 'Python'],
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
                location={exp.location}
                achievements={exp.achievements}
                techStack={exp.techStack}
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