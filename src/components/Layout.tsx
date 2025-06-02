import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, Github, Linkedin, Mail, FileText, BookOpen, Moon, Sun } from 'lucide-react';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Experience', path: '/experience' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Photography', path: '/photography' },
    { name: 'RSS', path: '/rss' }
  ];

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/burak', label: 'GitHub' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/in/burak', label: 'LinkedIn' },
    { icon: <Mail className="h-5 w-5" />, href: 'mailto:hello@burak.dev', label: 'Email' },
    { icon: <BookOpen className="h-5 w-5" />, href: 'https://medium.com/@burak', label: 'Medium' },
    { icon: <FileText className="h-5 w-5" />, href: '/cv.pdf', label: 'Download CV' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
              <span className="font-semibold text-lg">Obin</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
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
              <span className="font-medium text-gray-800 dark:text-gray-200">Obin</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Burak. 
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;