import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { createPhotoManifest, Photo } from '../utils/photoLoader';
import { PHOTO_MANIFEST } from '../data/photoManifest';

// Photo component with loading states and optimization
const PhotoCard: React.FC<{ photo: Photo; onOpen: (photo: Photo) => void; index: number }> = ({ 
  photo, 
  onOpen, 
  index 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="relative cursor-pointer overflow-hidden rounded-lg group"
      onClick={() => onOpen(photo)}
    >
      {/* Loading skeleton with shimmer animation */}
      {!imageLoaded && !imageError && (
        <div className="w-full h-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 dark:text-gray-500 text-sm font-medium">Loading photo...</div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {imageError && (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📷</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Failed to load photo</div>
          </div>
        </div>
      )}
      
      {/* Actual image with performance optimizations */}
      {!imageError && (
        <img 
          src={photo.url} 
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-auto transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ 
            imageRendering: 'auto',
            // Add a slight blur while loading for better perceived performance
            filter: imageLoaded ? 'none' : 'blur(5px)'
          }}
        />
      )}
      
      {/* Hover overlay - only show when image is loaded */}
      {imageLoaded && !imageError && (
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
      )}
      
      {/* Folder Badge - only show when image is loaded */}
      {imageLoaded && !imageError && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {photo.folder}
        </div>
      )}
    </div>
  );
};

const Photography: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  
  // Generate photos dynamically from the manifest
  const photos: Photo[] = useMemo(() => {
    return createPhotoManifest(PHOTO_MANIFEST);
  }, []);

  // Get unique folders from the actual photos (only folders that have photos)
  const folders = useMemo(() => {
    const uniqueFolders = Array.from(new Set(photos.map(photo => photo.folder)));
    return ['All', ...uniqueFolders.sort()];
  }, [photos]);

  // Filter and shuffle photos
  const displayedPhotos = useMemo(() => {
    let filteredPhotos = selectedFolder === 'All' 
      ? photos 
      : photos.filter(photo => photo.folder === selectedFolder);
    
    // Shuffle photos for random display when "All" is selected
    if (selectedFolder === 'All') {
      filteredPhotos = [...filteredPhotos].sort(() => Math.random() - 0.5);
    }
    
    return filteredPhotos;
  }, [photos, selectedFolder]);

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
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Snapshots from my travels, hobbies, and life moments
          </p>
        </AnimatedSection>
        
        {/* Filter Buttons */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedFolder === folder
                    ? 'bg-primary-600 text-white dark:bg-primary-500 shadow-lg'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        </AnimatedSection>
        
        {/* Photo Count */}
        <AnimatedSection delay={0.2}>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {displayedPhotos.length} photo{displayedPhotos.length !== 1 ? 's' : ''} 
            {selectedFolder !== 'All' && ` in ${selectedFolder}`}
          </p>
        </AnimatedSection>
        
        {/* Masonry Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPhotos.map((photo, index) => (
            <AnimatedSection key={`${selectedFolder}-${photo.id}`} delay={index * 0.05}>
              <PhotoCard photo={photo} onOpen={openLightbox} index={index} />
            </AnimatedSection>
          ))}
        </div>
        
        {/* Empty State */}
        {displayedPhotos.length === 0 && (
          <AnimatedSection delay={0.3}>
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No photos found in {selectedFolder} folder.
              </p>
            </div>
          </AnimatedSection>
        )}
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
            <div className="text-white text-center mt-4">
              <p className="text-lg">{selectedPhoto.alt}</p>
              <p className="text-sm text-gray-300">{selectedPhoto.folder}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photography;