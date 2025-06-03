import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, Github, Linkedin, Mail, FileText, BookOpen, Moon, Sun, ChevronDown } from 'lucide-react';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    { name: 'Experience', path: '/experience' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Photography', path: '/photography' },
    { name: 'RSS', path: '/rss' }
  ];

  const aboutDropdownItems = [
    { name: 'About', path: '/about' },
    { name: 'Uses', path: '/uses' }
  ];

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/burakintisah', label: 'GitHub' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/in/burakintisah', label: 'LinkedIn' },
    { icon: <Mail className="h-5 w-5" />, href: 'mailto:burak@intisah.com', label: 'Email' },
    { icon: <BookOpen className="h-5 w-5" />, href: 'https://medium.com/@burak.intisah', label: 'Medium' },
    { icon: <FileText className="h-5 w-5" />, href: '/burak_intisah_resume.pdf', label: 'Download Resume' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAboutSectionActive = () => {
    return location.pathname === '/about' || location.pathname === '/uses';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
              <Terminal className="h-6 w-6" />
              <span className="font-semibold text-lg">obIn</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                  isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Home
              </Link>
              
              {/* About Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <button
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isAboutSectionActive() ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                  aboutDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <div className="py-2">
                    {aboutDropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isActive(item.path) 
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive(link.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-900 px-4 py-4 shadow-lg dark:shadow-gray-800 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-base font-medium transition-colors ${
                  isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Home
              </Link>
              
              {/* Mobile About Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">About</div>
                {aboutDropdownItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block text-base font-medium transition-colors ml-4 ${
                      isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium transition-colors ${
                    isActive(link.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Social Links */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-50">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
      
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Terminal className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-gray-800 dark:text-gray-200">obIn</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Osman Burak Intisah
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;