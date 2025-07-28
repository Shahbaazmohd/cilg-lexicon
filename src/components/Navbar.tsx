import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'About', href: '/about' },
    { 
      name: 'Blog', 
      href: '/blog',
      hasDropdown: true,
      subItems: [
        { name: 'Blog Posts', href: '/blog' },
        { name: 'About the Blog', href: '/blog/about' },
        { name: 'CILG Blog', href: '/blog/cilg' }
      ]
    },
    { 
      name: 'Blog Submissions', 
      href: '/submissions',
      hasDropdown: true,
      subItems: [
        { name: 'Submission Guidelines', href: '/submissions/guidelines' },
        { name: 'Submit a Manuscript', href: '/submit-blog' }
      ]
    },
    { name: 'Cosmopolitan Bulletin', href: '/bulletin' },
    { name: 'Events & Notices', href: '/events' },
    { name: 'Meet the Team', href: '/team' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (subItems: any[]) => subItems.some(item => isActive(item.href));

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="academic-container">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png" 
                alt="CILG Logo" 
                className="w-10 h-10"
              />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground leading-tight">Centre for International<br />Law & Governance</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleDropdown(item.name);
                        }
                      }}
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isDropdownActive(item.subItems) || openDropdown === item.name
                          ? 'text-primary bg-primary/5'
                          : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                      aria-expanded={openDropdown === item.name}
                      aria-haspopup="true"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                        <div className="py-1">
                          {item.subItems.map((subItem, index) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={closeDropdown}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  closeDropdown();
                                }
                              }}
                              className={`block px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:bg-primary/5 ${
                                isActive(subItem.href)
                                  ? 'text-primary bg-primary/5'
                                  : 'text-foreground hover:text-primary hover:bg-primary/5'
                              }`}
                              tabIndex={0}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 p-0"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          isDropdownActive(item.subItems) || openDropdown === item.name
                            ? 'text-primary bg-primary/5'
                            : 'text-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                        onClick={() => toggleDropdown(item.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleDropdown(item.name);
                          }
                        }}
                        aria-expanded={openDropdown === item.name}
                        aria-haspopup="true"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                isActive(subItem.href)
                                  ? 'text-primary bg-primary/5'
                                  : 'text-foreground hover:text-primary hover:bg-primary/5'
                              }`}
                              onClick={() => {
                                setIsOpen(false);
                                closeDropdown();
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/5'
                          : 'text-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;