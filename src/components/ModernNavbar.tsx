import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { simpleAuthService, type SimpleAuthState } from '@/lib/simpleAuthService';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'About', href: '/about' },
  { 
    name: 'Blog', 
    href: '/blog',
    hasDropdown: true,
    subItems: [
      { name: 'Blog Posts', href: '/blog' },
      { name: 'About the Blog', href: '/blog/about' }
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

const ModernNavbar = () => {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authState, setAuthState] = useState<SimpleAuthState>({
    isAuthenticated: false,
    isAdmin: false,
    user: null
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up authentication state listener
  useEffect(() => {
    const checkAuth = () => {
      // Check if session is expired
      if (simpleAuthService.isAuthExpired()) {
        // Clear auth and update state
        simpleAuthService.clearAuth();
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          user: null
        });
        
        // Show expiration notification if user was previously authenticated
        if (authState.isAuthenticated) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "default"
          });
        }
        
        // Redirect to login if on admin page
        if (location.pathname.startsWith('/admin')) {
          navigate('/admin/login');
        }
        return;
      }

      const state = simpleAuthService.getAuthState();
      setAuthState(state);
    };

    // Initial check
    checkAuth();

    // Set up interval to check auth status (every 30 seconds)
    const authCheckInterval = setInterval(checkAuth, 30000);

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [location.pathname, navigate, toast, authState.isAuthenticated]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuState(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Close dropdowns and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const mobileMenu = document.querySelector('[data-mobile-menu]');
      const hamburgerButton = document.querySelector('[data-hamburger-button]');
      const dropdownRefs = document.querySelectorAll('[data-dropdown]');
      
      // Check if click is outside mobile menu
      if (menuState && mobileMenu && !mobileMenu.contains(target) && 
          hamburgerButton && !hamburgerButton.contains(target)) {
        setMenuState(false);
        setOpenDropdown(null);
      }
      
      // Check if click is outside desktop dropdowns
      if (openDropdown && dropdownRefs.length > 0) {
        let clickedInsideDropdown = false;
        dropdownRefs.forEach(dropdown => {
          if (dropdown.contains(target)) {
            clickedInsideDropdown = true;
          }
        });
        
        // Also check if the click is on a dropdown button itself
        const dropdownButtons = document.querySelectorAll('[data-dropdown-button]');
        dropdownButtons.forEach(button => {
          if (button.contains(target)) {
            clickedInsideDropdown = true;
          }
        });
        
        // Check if click is on mobile dropdown items
        const mobileDropdownItems = document.querySelectorAll('[data-mobile-dropdown-item]');
        mobileDropdownItems.forEach(item => {
          if (item.contains(target)) {
            clickedInsideDropdown = true;
          }
        });
        
        if (!clickedInsideDropdown) {
          setOpenDropdown(null);
        }
      }
    };

    // Always listen for clicks outside, not just when mobile menu is open
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuState, openDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuState]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuState(false);
        setOpenDropdown(null);
      }
    };

    if (menuState) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuState]);

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (subItems: any[]) => subItems.some(item => isActive(item.href));

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownItemClick = (href: string) => {
    setOpenDropdown(null);
    setMenuState(false);
    navigate(href);
  };

  const handleMobileDropdownItemClick = (href: string) => {
    setMenuState(false);
    setOpenDropdown(null);
    navigate(href);
  };

  const handleMobileNavigation = (href: string) => {
    setMenuState(false);
    setOpenDropdown(null);
    navigate(href);
  };

  const handleAdminClick = () => {
    setMenuState(false);
    setOpenDropdown(null);
    
    // Check if user is authenticated using auth service
    if (authState.isAuthenticated && authState.isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      simpleAuthService.signOut();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
        variant: "default"
      });
      
      setMenuState(false);
      setOpenDropdown(null);
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: 'An unexpected error occurred',
        variant: "destructive"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <nav
        data-state={menuState && 'active'}
        className="w-full px-2 group">
        <div className={cn(
          'mx-auto mt-2 max-w-7xl px-4 transition-all duration-300 lg:px-8', 
          isScrolled && 'bg-background/95 max-w-6xl rounded-2xl border backdrop-blur-lg lg:px-6 shadow-lg'
        )}>
          <div className="relative flex items-center justify-between gap-4 py-2 lg:gap-0 lg:py-3 min-h-[60px]">
            {/* Logo Section - Fixed width */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center space-x-3 touch-manipulation">
                <img 
                  src="/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png" 
                  alt="CILG Logo" 
                  className="w-8 h-8 flex-shrink-0"
                />
                <div className="hidden sm:block flex-shrink-0">
                  <p className="text-xs font-bold text-muted-foreground leading-tight">
                    Centre for International<br />Law & Governance
                  </p>
                </div>
              </Link>
            </div>

            {/* Mobile Quick Links - Centrally Aligned */}
            <div className="flex-1 flex items-center justify-center gap-3 lg:hidden">
              <Link
                to="/about"
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors duration-150 touch-manipulation px-2 py-1 rounded-md",
                  isActive('/about')
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMenuState(false)}
              >
                About
              </Link>
              <Link
                to="/blog"
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors duration-150 touch-manipulation px-2 py-1 rounded-md",
                  isActive('/blog')
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMenuState(false)}
              >
                Blog
              </Link>
              <Link
                to="/bulletin"
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors duration-150 touch-manipulation px-2 py-1 rounded-md",
                  isActive('/bulletin')
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setMenuState(false)}
              >
                Bulletin
              </Link>
            </div>

            {/* Desktop Navigation - Centered with proper spacing */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <ul className="flex gap-4 text-sm">
                {navigation.map((item, index) => (
                  <li key={index} className="relative">
                    {item.hasDropdown ? (
                      <div>
                        <button
                          data-dropdown-button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.name);
                          }}
                          className={cn(
                            "text-muted-foreground hover:text-accent-foreground block duration-150 flex items-center space-x-1",
                            isDropdownActive(item.subItems) || openDropdown === item.name
                              ? 'text-primary'
                              : ''
                          )}
                          aria-expanded={openDropdown === item.name}
                          aria-haspopup="true"
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-3 w-3 transition-transform",
                              openDropdown === item.name ? 'rotate-180' : ''
                            )}
                          />
                        </button>
                        {openDropdown === item.name && (
                          <div data-dropdown className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                            {item.subItems.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDropdownItemClick(subItem.href);
                                }}
                                className={cn(
                                  "block w-full text-left px-4 py-2 text-sm transition-colors duration-150",
                                  isActive(subItem.href)
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "text-muted-foreground hover:text-accent-foreground block duration-150",
                          isActive(item.href) && "text-primary"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Mobile Menu Button and Admin Button */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                data-hamburger-button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-[110] -m-2.5 -mr-4 block cursor-pointer p-2.5 touch-manipulation lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 hover:bg-background transition-colors">
                <Menu className="m-auto size-6" />
              </button>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                {authState.isAuthenticated && authState.isAdmin ? (
                  <>
                    <Button
                      onClick={() => navigate('/admin/dashboard')}
                      size="sm"
                      variant="outline"
                      className="bg-background hover:bg-muted text-foreground">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAdminClick}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Admin</span>
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Outside nav structure for proper positioning */}
      {menuState && (
        <div 
          data-mobile-menu
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-lg z-[105] lg:hidden">
          {/* Mobile Menu Close Button */}
          <button
            onClick={() => setMenuState(false)}
            aria-label="Close Menu"
            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col h-full w-full pt-20 pb-6 px-6 overflow-y-auto">
            {/* Mobile Navigation Links */}
            <div className="flex-1">
              <ul className="space-y-4 text-lg">
                {navigation.map((item, index) => (
                  <li key={index}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          data-dropdown-button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(item.name);
                          }}
                          className={cn(
                            "text-foreground hover:text-primary block duration-150 flex items-center justify-between w-full touch-manipulation py-4 px-2 rounded-lg transition-colors font-medium",
                            isDropdownActive(item.subItems) || openDropdown === item.name
                              ? "text-primary bg-primary/10"
                              : "hover:bg-muted/50"
                          )}
                          aria-expanded={openDropdown === item.name}
                          aria-haspopup="true"
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 transition-transform duration-200",
                              openDropdown === item.name ? "rotate-180" : ""
                            )}
                          />
                        </button>
                        {openDropdown === item.name && (
                          <div className="mt-2 ml-4 space-y-2 bg-muted/30 rounded-lg p-3 relative z-50">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.href}
                                data-mobile-dropdown-item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Mobile dropdown item clicked:', subItem.href);
                                  setMenuState(false);
                                  setOpenDropdown(null);
                                }}
                                className={cn(
                                  "block w-full text-left text-base transition-colors duration-150 touch-manipulation py-3 px-3 rounded-md hover:bg-primary/5 active:bg-primary/10",
                                  isActive(subItem.href)
                                    ? "text-primary bg-primary/10 font-medium"
                                    : "text-foreground hover:text-primary"
                                )}
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
                        className={cn(
                          "text-foreground hover:text-primary block duration-150 touch-manipulation py-4 px-2 rounded-lg transition-colors font-medium",
                          isActive(item.href) 
                            ? "text-primary bg-primary/10" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setMenuState(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

                {/* Mobile Action Buttons */}
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-col space-y-3">
                    {authState.isAuthenticated && authState.isAdmin ? (
                      <>
                        <Button
                          onClick={() => {
                            navigate('/admin/dashboard');
                            setMenuState(false);
                          }}
                          size="lg"
                          variant="outline"
                          className="w-full bg-background hover:bg-muted text-foreground touch-manipulation py-4 text-base font-medium">
                          <Shield className="h-5 w-5 mr-2" />
                          <span>Dashboard</span>
                        </Button>
                        <Button
                          onClick={handleLogout}
                          size="lg"
                          variant="ghost"
                          className="w-full text-muted-foreground hover:text-foreground hover:bg-muted touch-manipulation py-4 text-base font-medium">
                          <LogOut className="h-5 w-5 mr-2" />
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleAdminClick}
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation py-4 text-base font-medium">
                        <Shield className="h-5 w-5 mr-2" />
                        <span>Admin</span>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full touch-manipulation py-4 text-base font-medium">
                      <Link to="/contact" onClick={() => setMenuState(false)}>
                        <span>Contact Us</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
    </header>
  );
};

export default ModernNavbar; 