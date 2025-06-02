import React, { useState } from 'react';
import { X } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

interface Photo {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
}

const Photography: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  const photos: Photo[] = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Workspace with laptop and coffee',
      width: 1200,
      height: 800,
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Forest path',
      width: 800,
      height: 1200,
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'City skyline at night',
      width: 1200,
      height: 900,
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Coding on laptop',
      width: 1200,
      height: 800,
    },
    {
      id: 5,
      url: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Mountain landscape',
      width: 1200,
      height: 800,
    },
    {
      id: 6,
      url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Developer workspace',
      width: 800,
      height: 1000,
    },
    {
      id: 7,
      url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Coffee and laptop',
      width: 1000,
      height: 800,
    },
    {
      id: 8,
      url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Beach sunset',
      width: 1200,
      height: 800,
    },
    {
      id: 9,
      url: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Urban architecture',
      width: 800,
      height: 1200,
    },
  ];

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <AnimatedSection>
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Photography</h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            Snapshots from my travels and behind-the-scenes coding moments
          </p>
        </AnimatedSection>
        
        {/* Masonry Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <AnimatedSection key={photo.id} delay={index * 0.05}>
              <div 
                className="relative cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => openLightbox(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.alt}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 mb-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>View Photo</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>
          <div 
            className="max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.alt} 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Photography;