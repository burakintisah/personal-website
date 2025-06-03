import React, { useState, useMemo } from 'react';
import { BookOpen, Star, ExternalLink, Search, X } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  rating: number;
  tags: string[];
  purchaseLink: string;
  coverImage: string;
}

const Bookshelf: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const books: Book[] = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2024,
      rating: 5,
      tags: ['Programming', 'Software Engineering', 'Best Practices'],
      purchaseLink: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg'
    },
    {
      id: 2,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      year: 2024,
      rating: 5,
      tags: ['Programming', 'Career', 'Software Engineering'],
      purchaseLink: 'https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099.jpg'
    },
    {
      id: 3,
      title: 'Atomic Habits',
      author: 'James Clear',
      year: 2023,
      rating: 4,
      tags: ['Self-Improvement', 'Productivity', 'Psychology'],
      purchaseLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/1847941834',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg'
    },
    {
      id: 4,
      title: 'System Design Interview',
      author: 'Alex Xu',
      year: 2023,
      rating: 4,
      tags: ['System Design', 'Interview', 'Architecture'],
      purchaseLink: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF',
      coverImage: 'https://m.media-amazon.com/images/I/61CekcUc2EL._SL1360_.jpg'
    },
    {
      id: 5,
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      year: 2023,
      rating: 5,
      tags: ['Database', 'System Design', 'Architecture'],
      purchaseLink: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1415816873i/23463279.jpg'
    },
    {
      id: 6,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      year: 2022,
      rating: 4,
      tags: ['Finance', 'Psychology', 'Personal Development'],
      purchaseLink: 'https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg'
    },
    {
      id: 7,
      title: 'Refactoring',
      author: 'Martin Fowler',
      year: 2022,
      rating: 5,
      tags: ['Programming', 'Software Engineering', 'Best Practices'],
      purchaseLink: 'https://www.amazon.com/Refactoring-Improving-Existing-Addison-Wesley-Signature/dp/0134757599',
      coverImage: 'https://martinfowler.com/books/refact2.jpg'
    }
  ];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    books.forEach(book => book.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [books]);

  const allYears = useMemo(() => {
    const years = new Set(books.map(book => book.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => book.tags.includes(tag));
      const yearMatch = selectedYear === 'all' || book.year.toString() === selectedYear;
      const searchMatch = searchQuery === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return tagMatch && yearMatch && searchMatch;
    });
  }, [books, selectedTags, selectedYear, searchQuery]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedYear('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedYear !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              My Bookshelf
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Books that have shaped my thinking and improved my skills.
            </p>
          </div>
        </AnimatedSection>

        {/* Enhanced Filters */}
        <AnimatedSection>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books, authors, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Year
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedYear === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All Years
                </button>
                {allYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year.toString())}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === year.toString()
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters & Clear */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredBooks.length} of {books.length} books
                </div>
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Books Grid */}
        <AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/50 overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-700/70 transition-all duration-300 group"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center" style={{ display: 'none' }}>
                    <BookOpen className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                  </div>
                  
                  {/* Purchase Link Overlay */}
                  <a
                    href={book.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label={`Buy ${book.title}`}
                  >
                    <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </a>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                    {book.author}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex">
                      {renderStars(book.rating)}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {book.year}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {book.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                    {book.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{book.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {filteredBooks.length === 0 && (
          <AnimatedSection>
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No books found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or search terms.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default Bookshelf; 